import React from 'react';

const cities = require('../data/cities.json');
const LOOKUP = {};
const COUNTRIES = [];

cities.forEach(function(city) {

	// Country to subcountries
	if (LOOKUP[city.country]) {
		const subcountries = LOOKUP[city.country];
		if (!subcountries.includes(city.subcountry)) {
			subcountries.push(city.subcountry);
		}
	} else {
		COUNTRIES.push(city.country);
		const subcountries = [];
		subcountries.push(city.subcountry);
		LOOKUP[city.country] = subcountries;
	}

	// Subcountry to cities
	if (LOOKUP[city.subcountry]) {
		const cities = LOOKUP[city.subcountry];
		if (!cities.includes(city.name)) {
			cities.push(city.name);
		}
	} else {
		const cities = [];
		cities.push(city.name);
		LOOKUP[city.subcountry] = cities;
	}
});

COUNTRIES.sort();

Object.keys(LOOKUP).forEach(function(key) {
	const values = LOOKUP[key];
	values.sort();
});


function setDirty(props) {
    if (props.data.changed) return;

    props.data.changed = true;
    const rows = [];
    rows.push(props.node);
    props.node.selectable = true;
    props.api.redrawRows({ rowNodes: rows });
}

export function CountryRenderer(props) {

	const onChangeCountry = (e) => {
		setDirty(props);

		props.data.country = e.target.value;
		props.data.subcountry = "";
		props.data.city = "";
		props.api.refreshCells({ columns: ['subcountry', 'city'], force: true });
	};

	return (
		<div>
			<select defaultValue={props.data.country} onChange={(e) => onChangeCountry(e)}>
				<option key=""></option>
				{COUNTRIES.map(country =>
					<option key={country}>{country}</option>
				)}
			</select>
		</div>
	)
}

export function SubcountryRenderer(props) {
	var country = props.data.country;
	var subcountries = [""];
	if (country) {
		subcountries = LOOKUP[country];
	}

	const onChangeSubcountry = (e) => {
		setDirty(props);

		props.data.subcountry = e.target.value;
		props.data.city = "";
		props.api.refreshCells({ columns: ['city'], force: true });
	};

	return (
		<div>
			<select defaultValue={props.data.subcountry} onChange={(e) => onChangeSubcountry(e)}>
				<option key=""></option>
				{subcountries.map(subcountry =>
					<option key={subcountry}>{subcountry}</option>
				)}
			</select>
		</div>
	)
}

export function CityRenderer(props)  {
	var subcountry = props.data.subcountry;
	var cities = [""];
	if (subcountry) {
		cities = LOOKUP[subcountry];
	}

	const onChangeCity = (e) => {
		setDirty(props);

		props.data.city = e.target.value;
	};

	return (
		<div>
			<select defaultValue={props.data.city} onChange={(e) => onChangeCity(e)}>
				<option key=""></option>
				{cities.map(city =>
					<option key={city}>{city}</option>
				)}
			</select>
		</div>
	)
}
