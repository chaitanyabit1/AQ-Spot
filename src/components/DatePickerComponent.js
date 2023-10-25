import React from "react";
import { Controller } from "react-hook-form";
import { DATE_TIME_FORMAT } from "../config/AppConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const DatePickerComponent = (props) => {    
    //console.log(errors);
    const {defaultValue, fieldName, errors, control, require, showTime} = props;
    let defaultVal = "";
    let momentFormat = DATE_TIME_FORMAT.DDMMYYYYHHmm;
    let datePickerFormat = DATE_TIME_FORMAT.DATEPICKERDATETIME;
    let showTimeSelect = "showTimeSelect";
    if(showTime === false) {
        momentFormat = DATE_TIME_FORMAT.DDMMYYYY;
        datePickerFormat = DATE_TIME_FORMAT.DATEPICKERDATE;
        showTimeSelect = "";
    }
    
    if(moment(defaultValue, momentFormat).isValid) {
        defaultVal = Number(Date.parse(moment(defaultValue, momentFormat).format()));
    } else {
        defaultVal = Number(Date.parse(defaultValue));
    }

    let minDate = (props.minDate) ? Number(props.minDate) : 0;
    let maxDate = (props.maxDate) ? Number(props.maxDate) : 0;
    
    return(
        <div>
        <Controller
            control={control}
            name={fieldName}
            defaultValue={defaultVal}
            render={({onChange, value}) => (
                <DatePicker
                    selected={value}
                    onChange={onChange}
                    showTimeSelect={showTimeSelect}
                    dateFormat={datePickerFormat}
                    customInput={<input
                        type="text"
                        className={"form-control " + (errors[fieldName] && "is-invalid")}
                        name={fieldName}
                    />}
                    value={value}
                    wrapperClassName="datepicker-custom-width"
                    minDate={minDate}
                    maxDate={maxDate}
                    dropdownMode="select"
                    showMonthDropdown
                    showYearDropdown
                    adjustDateOnChange
                />
            )}
            valueName="selected"
            errors={errors}
            rules={{
                required: Boolean({require}),
            }}
        />
        </div>
    );
};

export default DatePickerComponent;