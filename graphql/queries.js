import { gql } from "@apollo/client";

export const GET_SPEAKERS_CONCAT = gql`
  query ($afterCursor: String, $limit: Int) {
    speakersConcat(afterCursor: $afterCursor, limit: $limit) {
      datalist {
        id
        first
        last
        favorite
        cursor
        fullName @client
        checkBoxColumn @client
      }
      pageInfo {
        totalItemCount
        lastCursor
        hasNextPage
      }
    }
  }
`;

export const GET_SPEAKERS = gql`
  query ($offset: Int, $limit: Int) {
    speakers(offset: $offset, limit: $limit) {
      datalist {
        id
        first
        last
        favorite
        fullName @client
        checkBoxColumn @client
      }
      pageInfo {
        totalItemCount
      }
    }
  }
`;
