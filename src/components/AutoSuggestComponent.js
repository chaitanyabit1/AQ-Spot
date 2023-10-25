import React, {useState, useEffect} from "react";
import Autosuggest from 'react-autosuggest';
import { listAll } from "../services/PatientService";
import AutoSuggest from "react-autosuggest";
import "../assets/css/autosuggest.css";

// const AutoSuggestComponent = (props) => {
// 	const [state, setState] = useState(
// 		{
// 			value: '',
// 			suggestions: [],
// 			isLoading: false
// 		}
// 	);
// 	const [suggestVal, setSuggestVal] = useState([]);
// 	const lastRequestId = null;
	
// 	useEffect(() => {
// 		let isMounted = true;
// 		let q = '';
// 		if (suggestVal !== '') {
// 			q = "&query=" + suggestVal;
// 		}
// 		setState({isLoading: true});
// 		// listAll(q).then((res) => {
//     //   const data = res.data;
//     //   const listData = [];

//     //   data.forEach((item) => {
//     //     listData.push({
// 		// 			id: item.id,
//     //       name: item.name
//     //     });
//     //   });
// 		// 	console.log(listData, "listdata");
// 		// 	if (isMounted) {
// 		// 		setState({
// 		// 			suggestions: listData,
// 		// 			isLoading: false
// 		// 		});
// 		// 	}
// 		// });
// 		let listData = [{id: 3, name: "Rajni P Patel"}, {id: 7, name: "Darsh M Kanjariya"}];
// 		if (isMounted) {
// 			setState({
// 				suggestions: listData,
// 				isLoading: false
// 			});
// 		}
// 		return () => { isMounted = false };
// 	},[suggestVal]);

// 	const onChange = ({ newValue }) => {
//     setState({
//       value: newValue
//     });
//   };
    
//   const onSuggestionsFetchRequested = ({ value }) => {
//     //loadSuggestions(value);
// 		console.log(value,"enteredval");
// 		setSuggestVal(value);
//   };

//   const onSuggestionsClearRequested = () => {
//     setState({
//       suggestions: []
//     });
//   };

// 	const inputProps = {
// 		placeholder: "Type name",
// 		value: state.value,
// 		onChange: onChange
// 	};

// 	const getSuggestionValue = (suggestion) => {
// 		console.log(suggestion, 'suggestion');
// 		return suggestion.name;
// 	}
	
// 	const renderSuggestion = (suggestion) => {
// 		console.log(suggestion, 'suggestion1');
// 		return (
// 			<span>{suggestion.name}</span>
// 		);
// 	}

// 	return (
// 		<div>
// 			<Autosuggest 
// 				suggestions={state.suggestions}
// 				onSuggestionsFetchRequested={onSuggestionsFetchRequested}
// 				onSuggestionsClearRequested={onSuggestionsClearRequested}
// 				getSuggestionValue={getSuggestionValue}
// 				renderSuggestion={renderSuggestion}
// 				inputProps={inputProps} />
// 		</div>
// 	);
// };

// export default AutoSuggestComponent;

// const AutoSuggestComponent = () => {
// 	const [value, setValue] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const getSuggestions = (value) => {
//     // return lowerCasedCompanies.filter(company =>
//     //   company.name.includes(value.trim().toLowerCase())
//     // );
// 		//setSuggestVal(value);
//     if (value.length <= 1) {
//         return [];
//     }
// 		let q = '';
// 		if (value !== '') {
// 			q = "&query=" + value;
// 		}
		
// 		listAll(q).then((res) => {
//       const data = res.data;
//       const listData = [];

//       data.forEach((item) => {
//         listData.push({
//           name: item.name
//         });
//       });
// 			console.log(listData, "listdata");
// 			return listData;
// 		});
//   };

// 	return (
//     <div>
//       <Autosuggest
//         suggestions={suggestions}
//         onSuggestionsClearRequested={() => setSuggestions([])}
//         onSuggestionsFetchRequested={({ value }) => {
//           console.log(value);
//           setValue(value);
//           setSuggestions(getSuggestions(value));
//         }}
//         onSuggestionSelected={(_, { suggestionValue }) =>
//           console.log("Selected: " + suggestionValue)
//         }
//         getSuggestionValue={suggestion => suggestion.name}
//         renderSuggestion={suggestion => <span>{suggestion.name}</span>}
//         inputProps={{
//           placeholder: "Type 'c'",
//           value: value,
//           onChange: (_, { newValue, method }) => {
//             setValue(newValue);
//           }
//         }}
//         highlightFirstSuggestion={true}
//       />
//     </div>
//   );
// };
// export default AutoSuggestComponent;

const companies = [
];

const AutoSuggestComponent = () => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let q = "&query=" + value;
    listAll(q).then((res) => {
      const data = res.data;
      const listData = [];

      data.forEach((item) => {
        listData.push({
          id: item.id,
          name: item.name
        });
      });
			console.log(listData, "listdata");
      setSuggestions(listData);
			//return listData;
		});
  },[value]);
  
  return (
    <div>
      <AutoSuggest
        suggestions={suggestions}
        onSuggestionsClearRequested={() => setSuggestions([])}
        onSuggestionsFetchRequested={({ value }) => {
          setValue(value);
          //setSuggestions(getSuggestions(value));
        }}
        onSuggestionSelected={(_, { suggestion, suggestionValue }) =>
          console.log("Selected: " + suggestionValue + " Sugges" + suggestion.id)
        }
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={suggestion => <span>{suggestion.name}</span>}
        inputProps={{
          placeholder: "Type patient name",
          value: value,
          onChange: (_, { newValue, method }) => {
            setValue(newValue);
          }
        }}
        highlightFirstSuggestion={true}
      />
    </div>
  );
};

export default AutoSuggestComponent;