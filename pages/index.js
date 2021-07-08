import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_SPEAKERS = gql`
  query {
    speakers {
      datalist {
        id
        first
        last
        favorite
      }
    }
  }
`;

function Index(props) {
  const { loading, error, data } = useQuery(GET_SPEAKERS);

  if (loading) return <div>Loading....</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div className="container show-fav">
      <div className="row">
        <div className="fav-list">
          {data?.speakers?.datalist.map(({ id, first, last, favorite }) => {
            return (
              <div className="favbox" key={id}>
                <div className="fav-clm col-sm-7">
                  <h4>
                    {first} {last} ({id})
                  </h4>
                </div>
                <div className="fav-clm col-sm-5">
                  <span>Favorite {favorite === true ? "Yes" : "No"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Index;
