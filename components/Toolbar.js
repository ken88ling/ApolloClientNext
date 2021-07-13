import React from "react";
import { useForm } from "react-hook-form";
import { GET_SPEAKERS } from "../graphql/queries";
import { ADD_SPEAKER, TOGGLE_SPEAKER_FAVORITE } from "../graphql/mutations";
import { useApolloClient, useMutation, useReactiveVar } from "@apollo/client";
import {
  checkBoxListVar,
  currentThemeVar,
  paginationDataVar,
} from "../graphql/apolloClient";
import PagingOffsetLimitControl from "./PagingOffsetLimitControl";

export default function Toolbar({ totalItemCount }) {
  const { register, handleSubmit } = useForm();
  const [addSpeaker] = useMutation(ADD_SPEAKER);
  const [toggleSpeakerFavorite] = useMutation(TOGGLE_SPEAKER_FAVORITE);
  const apolloClient = useApolloClient();
  const currentTheme = useReactiveVar(currentThemeVar);
  const paginationData = useReactiveVar(paginationDataVar);

  const lastPage = Math.trunc((totalItemCount - 1) / paginationData.limit);

  const onSubmit = (d) => {
    insertSpeakerEvent(d.first, d.last, d.favorite);
  };

  const sortByIdDescending = () => {
    const { speakers } = apolloClient.cache.readQuery({
      query: GET_SPEAKERS,
      variables: {
        limit: paginationData.limit,
        offset: paginationData.offset,
      },
    });
    apolloClient.cache.writeQuery({
      query: GET_SPEAKERS,
      variables: {
        limit: paginationData.limit,
        offset: paginationData.offset,
      },
      data: {
        speakers: {
          __typename: "SpeakerResults",
          datalist: [...speakers.datalist].sort((a, b) => b.id - a.id),
        },
      },
    });
  };

  const insertSpeakerEvent = (first, last, favorite) => {
    addSpeaker({
      variables: {
        first,
        last,
        favorite,
      },
      update: (cache, { data: { addSpeaker } }) => {
        const { speakers } = cache.readQuery({
          query: GET_SPEAKERS,
          variables: {
            limit: paginationData.limit,
            offset: paginationData.offset,
          },
        });
        cache.writeQuery({
          query: GET_SPEAKERS,
          variables: {
            limit: paginationData.limit,
            offset: paginationData.offset,
          },
          data: {
            speakers: {
              __typename: "SpeakerResults",
              datalist: [addSpeaker, ...speakers.datalist],
              pageInfo: {
                __typename: "PageInfo",
                totalItemCount: totalItemCount,
              },
            },
          },
        });
      },
    });
  };

  return (
    <div style={{ padding: "16px" }}>
      <h4>Create New Speaker</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label>First Name</label>
        <input {...register("first")} />
        <label>Last Name</label>
        <input {...register("last")} />
        <div>
          Is Favorite <input type="checkbox" {...register("favorite")} />
        </div>
        <input type="submit" value="submit" className='btn btn-primary' />
      </form>
      <hr />
      <button onClick={sortByIdDescending} className="btn btn-primary">
        <span>Sort Speakers by id descending</span>
      </button>
      <hr />
      <select
        className="btn btn-primary m-2"
        value={currentTheme}
        onChange={({ currentTarget }) => {
          currentThemeVar(currentTarget.value);
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <button
        className="btn btn-primary m-2"
        onClick={() => {
          const selectedSpeakerIds = checkBoxListVar();
          if (selectedSpeakerIds) {
            selectedSpeakerIds.forEach((speakerId) => {
              toggleSpeakerFavorite({
                variables: {
                  speakerId: parseInt(speakerId),
                },
              });
            });
          }
        }}
      >
        Toggle Favorite
      </button>
      <hr />
      <PagingOffsetLimitControl lastPage={lastPage} />
    </div>
  );
}
