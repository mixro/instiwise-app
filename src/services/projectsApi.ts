import { createApi  } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';
import { ProjectsItem } from '../interfaces/interfaces';
import { RootState } from '@/store/index';


export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery:  baseQueryWithReauth,
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsItem[], void>({
      query: () => '/projects',
      transformResponse: (response: { data: ProjectsItem[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Projects' as const, id: _id })),
              { type: 'Projects', id: 'LIST' },
            ]
          : [{ type: 'Projects', id: 'LIST' }],
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

        const patchResult = dispatch(
          projectsApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const project = draft.find(p => p._id === projectId);
            if (project) {
              if (!project.likes) {
                project.likes = [];
              }
              if (project.likes.includes(userId)) {
                project.likes = project.likes.filter(id => id !== userId);
              } else {
                project.likes.push(userId);
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
  useLikeProjectMutation,
} = projectsApi;