import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

function Places({ onSetLocation, onSetCenter }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ requestOptions: { region: "th" } });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: address });
      const { lat, lng } = await getLatLng(results[0]);
      onSetLocation({ lat, lng });
      onSetCenter({ lat, lng });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        className="w-full p-1 px-3 "
        placeholder="Search an address..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                key={place_id}
                className="bg-white p-3 border-t-2 hover:bg-slate-100"
                value={description}
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}

export default Places;
