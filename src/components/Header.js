import Places from "./Places";

function Header({ onSetOrigin, onSetDestination ,onSetCenter}) {
  return (
    <div className="flex flex-col p-5 bg-slate-200 gap-2">
      <h1>
        <b>Origin</b>
      </h1>
      <Places
        onSetLocation={(position) => {
          onSetOrigin(position);
        }}
        onSetCenter={onSetCenter}
      />
      <h1>
        <b>Destination</b>
      </h1>
      <Places
        onSetLocation={(position) => {
          onSetDestination(position);
        }}
        onSetCenter={onSetCenter}
      />
    </div>
  );
}

export default Header;
