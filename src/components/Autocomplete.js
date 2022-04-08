import React, { Component, Fragment } from "react";
import './styles.css'

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      focused: false
    };

    this.searchInput = React.createRef(null);
    //this.onFocus = this.onFocus.bind(this);
    //this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.setState({
      focused: true
    });
    
  }

  onBlur() {
    this.setState({
      focused: false
    });
    
  }

  onChange = e => {
    const { suggestions, setFormValue } = this.props;
    const userInput = e.currentTarget.value;
    let filteredSuggestions


    

    if (suggestions.length !== 0) {
      
      filteredSuggestions = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
      );
    } else {
      filteredSuggestions = []
    }
    

    setFormValue(e.currentTarget.value)
  
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };

  onClick = e => {
    const { setFormValue } = this.props;
    setFormValue(e.currentTarget.innerText)

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };

  onKeyDown = e => {
    const { setFormValue } = this.props;
    const { activeSuggestion, filteredSuggestions } = this.state;
  
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
      setFormValue(filteredSuggestions[activeSuggestion])

    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {

      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;
  
    let suggestionsListComponent;
    if(document.activeElement === this.searchInput.current) {
    //if(!this.focused) {
      
      if (showSuggestions && userInput) {
        if (filteredSuggestions.length) {
          suggestionsListComponent = (
            <ul class="suggestions">
              {filteredSuggestions.map((suggestion, index) => {
                let className;
      
                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                  className = "suggestion-active";
                }
                return (
                  <li className={className} key={suggestion} onClick={onClick}>
                    {suggestion}
                  </li>
                );
              })}
            </ul>
          );
        } else {
          suggestionsListComponent = (
            <div class="no-suggestions">
              <em>No suggestions available.</em>
            </div>
          );
        }
      }
    } else {
      suggestionsListComponent = (<></>)
    }

    return (
          <Fragment>
            <input
              ref={this.searchInput}
              id = "autoComp"
              type="text"
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={this.props.formValue}
              className={this.props.className}
            />
            {suggestionsListComponent}
          </Fragment>
      );
    }
  }
  
  export default Autocomplete;
