import React, {useState, useEffect} from "react";
import { listAll } from "../../services/PatientService";
import AutoSuggest from "react-autosuggest";
import "../../assets/css/autosuggest.css";

const AutoSuggestView = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const { setDataFilters, setCurrentPage, setPaginationData, value, setValue, selectedPID, setSelectedPID } = props;
    //const [selectedPID, setSelectedPID] = useState('');
  
    useEffect(() => {
      let q = "";
      if (value !== '' && selectedPID === '') {
        q = q + "&query=" + value;
      
      
        listAll(q).then((res) => {
          const data = res.data;
          const listData = [];
    
          data.forEach((item) => {
            listData.push({
              id: item.id,
              name: item.name
            });
          });
          setSuggestions(listData);
        });
      }
    },[value, selectedPID]);
    
    return (
      <div>
        <AutoSuggest
          suggestions={suggestions}
          onSuggestionsClearRequested={() => {setSuggestions([]);}}
          onSuggestionsFetchRequested={({ value }) => {
            setValue(value);
            //setSuggestions(getSuggestions(value));
          }}
          onSuggestionSelected={(_, { suggestion, suggestionValue }) => {
            //console.log("Selected: " + suggestionValue + " Sugges" + suggestion.id);
            setCurrentPage(1);
            setPaginationData({currentPage: 0, totalPages: 0, totalRows: 0});
            setDataFilters({
              pid: suggestion.id
            });
            setSelectedPID(suggestion.id);
          }}
          getSuggestionValue={suggestion => suggestion.name}
          renderSuggestion={suggestion => <span>{suggestion.name}</span>}
          inputProps={{
            placeholder: "Type patient name",
            value: value,
            onChange: (_, { newValue, method }) => {
              console.log(newValue,"newval");
              setValue(newValue);
              setSelectedPID('');
            }
          }}
          highlightFirstSuggestion={true}
        />
      </div>
    );
};

export default AutoSuggestView;