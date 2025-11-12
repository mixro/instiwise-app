import { createApi  } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';
import { ProjectsItem } from '../interfaces/interfaces';
import { RootState } from '@/store/index';
import { clearOptimisticLike, setLikePending, setOptimisticLike } from '@/store/slices/projectSlice';


export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery:  baseQueryWithReauth,
  tagTypes: ['Projects', 'UserProjects'],
  endpoints: (builder) => ({
    createProject: builder.mutation<ProjectsItem, Partial<ProjectsItem>>({
        query: (data) => ({
            url: '/projects',
            method: 'POST',
            body: data,
        }),
        invalidatesTags: ['Projects', 'UserProjects'],
    }),

    getProjects: builder.query<ProjectsItem[], void>({
      query: () => '/projects',
      transformResponse: (res: { data: ProjectsItem[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Projects' as const, id: _id })),
              { type: 'Projects', id: 'LIST' },
            ]
          : [{ type: 'Projects', id: 'LIST' }],
    }),

    getProjectById: builder.query<ProjectsItem | undefined, string>({
      queryFn: async (id: string, { getState }, _extraOptions, baseQuery): Promise<{ data: ProjectsItem | undefined }> => {
        const state = getState() as RootState;

        // 1. Try cache: getProjects
        const allProjectsSel = projectsApi.endpoints.getProjects.select(undefined)(state);
        const fromAll = allProjectsSel.data?.find(p => p._id === id);

        // 2. Try cache: getUserProjects
        const userProjectsSel = projectsApi.endpoints.getUserProjects.select(undefined)(state);
        const fromUser = userProjectsSel.data?.find(p => p._id === id);

        const cachedProject = fromAll ?? fromUser;

        if (cachedProject) {
          return { data: cachedProject };
        }

        // 3. Not in cache → fetch from network
        const result = await baseQuery(`/projects/${id}`);

        return { data: (result.data as { data: ProjectsItem }).data };
      },
      
      providesTags: (result, error, id) => [
        { type: 'Projects', id },
        { type: 'Projects', id: 'LIST' },
        { type: 'UserProjects', id },
        { type: 'UserProjects', id: 'LIST' },
      ],
    }),

    likeProject: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/like`,
        method: 'PUT',
      }),

      async onQueryStarted(projectId, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const userId = state.auth.currentUser?._id;
        if (!userId) return;

        // 1. Instant UI: pending + optimistic
        dispatch(setLikePending({ id: projectId, pending: true }));
        const currentLiked = state.projects.optimisticLikes[projectId] ?? (state.projects.likesPending[projectId] ? false : undefined);
        const willBeLiked = !(currentLiked ?? false);
        dispatch(setOptimisticLike({ id: projectId, liked: willBeLiked }));

        // 2. Optimistic cache update (O(1) with splice)
        const toggleLike = (draft: ProjectsItem[]) => {
          const p = draft.find((x) => x._id === projectId);
          if (!p) return;

          const idx = p.likes.indexOf(userId);
          if (idx !== -1) {
            p.likes.splice(idx, 1); // ← Fast unlike
          } else {
            p.likes.push(userId); // ← Fast like
          }
        };

        const patchAll = dispatch(
          projectsApi.util.updateQueryData('getProjects', undefined, toggleLike)
        );

        const patchUser = dispatch(
          projectsApi.util.updateQueryData('getUserProjects', undefined, toggleLike)
        );

        try {
          await queryFulfilled;
          dispatch(clearOptimisticLike(projectId)); // Use real data
        } catch {
          // Rollback
          patchAll.undo();
          patchUser.undo();
          dispatch(setOptimisticLike({ id: projectId, liked: !willBeLiked }));
        } finally {
          dispatch(setLikePending({ id: projectId, pending: false }));
        }
      },

      invalidatesTags: (result, error, projectId) => [
        { type: 'Projects', id: projectId },
        { type: 'Projects', id: 'LIST' },
        { type: 'UserProjects', id: projectId },
        { type: 'UserProjects', id: 'LIST' },
      ],
    }),
    
    getUserProjects: builder.query<ProjectsItem[], void>({
        query: () => '/projects/my/projects', 
        transformResponse: (res: { data: ProjectsItem[] }) => res.data,
        providesTags: (result) =>
            result
            ? [
                ...result.map(({ _id }) => ({ type: 'UserProjects' as const, id: _id })),
                { type: 'UserProjects', id: 'LIST' },
                ]
            : [{ type: 'UserProjects', id: 'LIST' }],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchAll = dispatch(
          projectsApi.util.updateQueryData('getProjects', undefined, (draft) =>
            draft.filter(p => p._id !== id)
          )
        );
        const patchUser = dispatch(
          projectsApi.util.updateQueryData('getUserProjects', undefined, (draft) =>
            draft.filter(p => p._id !== id)
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchAll.undo();
          patchUser.undo();
        }
      },

      invalidatesTags: (r, e, id) => [
        { type: 'Projects', id },
        { type: 'UserProjects', id },
      ],
    }),

    updateProject: builder.mutation<ProjectsItem, { id: string; updates: Partial<ProjectsItem> }>({
      query: ({ id, updates }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: updates,
      }),

      // Optimistic update
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchAll = dispatch(
          projectsApi.util.updateQueryData('getProjects', undefined, (draft) =>
            draft.map(p => (p._id === id ? { ...p, ...updates } : p))
          )
        );
        const patchUser = dispatch(
          projectsApi.util.updateQueryData('getUserProjects', undefined, (draft) =>
            draft.map(p => (p._id === id ? { ...p, ...updates } : p))
          )
        );

        try {
          const { data } = await queryFulfilled;
          // Replace with fresh data
          dispatch(
            projectsApi.util.updateQueryData('getProjects', undefined, (draft) =>
              draft.map(p => (p._id === id ? data : p))
            )
          );
          dispatch(
            projectsApi.util.updateQueryData('getUserProjects', undefined, (draft) =>
              draft.map(p => (p._id === id ? data : p))
            )
          );
        } catch {
          patchAll.undo();
          patchUser.undo();
        }
      },

      invalidatesTags: (result, error, { id }) => [
        { type: 'Projects', id },
        { type: 'UserProjects', id },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetUserProjectsQuery,
  useLikeProjectMutation,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} = projectsApi;