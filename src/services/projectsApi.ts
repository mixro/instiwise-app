import { createApi  } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';
import { ProjectsItem } from '../interfaces/interfaces';
import { RootState } from '@/store/index';


export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery:  baseQueryWithReauth,
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    // All projects
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
      queryFn: (id: string, { getState }): { data: ProjectsItem | undefined } => {
        const state = getState() as RootState;
        const projectsResult = projectsApi.endpoints.getProjects.select(undefined)(state);
        const project = projectsResult.data?.find((p) => p._id === id);
        return { data: project };
      },
      providesTags: (result, error, id) => [
        { type: 'Projects', id },
        { type: 'Projects', id: 'LIST' },
      ],
    }),

    likeProject: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/like`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, projectId) => [
        { type: 'Projects', id: projectId },
        { type: 'Projects', id: 'LIST' },
      ],
      async onQueryStarted(projectId, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const userId = state.auth.currentUser?._id;
        if (!userId) return;

        const patchResult = dispatch(
          projectsApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const p = draft.find((x) => x._id === projectId);
            if (p) {
              if (p.likes.includes(userId)) {
                p.likes = p.likes.filter((id) => id !== userId);
              } else {
                p.likes.push(userId);
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useLikeProjectMutation,
} = projectsApi;