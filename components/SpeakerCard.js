import React from "react";

const SpeakerCard = ({ speakerRec }) => {
  const { id, first, last, bio, favorite, company, twitterHandle } = speakerRec;

  const sessions = speakerRec?.sessions
    ? [...speakerRec.sessions]
        .sort((a, b) => {
          return b.eventYear.localeCompare(a.eventYear);
        })
        .slice(0, 3)
    : [];

  return (
    <div className="col-md-12 border p-3">
      <div className="d-flex">
        <div className="speaker-img">
          <span>
            <img 
              src={`//ddrt7tzfkdwdf.cloudfront.net/attendeeimage/${id}.jpg?width=250`}
              alt={`${first} ${last}`}
            />
          </span>
        </div>
        <div className="p-2">
          <div className="action">
            <span>
              <i
                className={
                  favorite === true
                    ? "fa fa-star orange"
                    : "fa fa-star-o orange"
                }
              />{" "}
              <span>Favorite</span>
            </span>
          </div>
          <h3>
            <span>
              {" "}
              {first} {last}
            </span>
          </h3>
          <p>{bio}</p>
          <div className="social">
            <div className="d-flex">
              <h5 className='px-2'>Company</h5>
              <h6 className='m-1'>{`${company ? company.slice(0, 6) + "..." : ""}`}</h6>
            </div>
            <div className="d-flex">
              <h5 className='px-2'>Twitter</h5>
              <h6 className='m-1'>{twitterHandle}</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="border">
        {sessions.map((session) => {
          return (
            <span className="d-flex" key={session.id}>
              "{session.title.slice(0, 75)} "{" "}
              <strong>Room: {session.room.name}</strong>&nbsp;&nbsp;
              <i>{session.eventYear}</i>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SpeakerCard;
