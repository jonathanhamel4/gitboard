import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import getFetch from "../utils/fetch";

export default function AsyncDropdown({source, defaultText, onChangeCb}) {
    const [selectedOption, setSelectedOption] = useState(null);

    const [menuItems, setMenuItems]= useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchData() {
        const {data, err} = await getFetch(source);
        const mappedData = data.map((o) => { return {key: o.login, text: o.login, value: o.login}});
        setError(err);
        setMenuItems(mappedData);
    }

    function handleOnChange(event, {value}) {
        setSelectedOption(value);
        onChangeCb && onChangeCb(value);
    }

    useEffect(() => {
        setIsLoading(true);
        fetchData();
        setIsLoading(false);
    }, []);

    return (
        <Dropdown clearable placeholder={defaultText} selection options={menuItems} loading={isLoading} onChange={handleOnChange} value={selectedOption} />
    )
}