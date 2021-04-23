import React, { useState, useEffect } from 'react';
import './DynamicGrid.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import faker from "faker";

export default function DynamicGrid() {
	const columnDefs = [{
		field: "row_id",
		headerName: "#",
		checkboxSelection: function(params) { return true; },
		width: 50,
		headerCheckboxSelection: true,
		pinned: 'left'
	},
	{ field: "name", headerName: "Name", filter: true, sortable: true, resizable: true, floatingFilter: true },
	{ field: "email", headerName: "Name", filter: true, sortable: true, resizable: true, floatingFilter: true },
	];

	const [data, setData] = useState([]);
	const [gridApi, setGridApi] = useState(null);
	const cities = require('./data/cities.json');
	console.log(cities[0]);

	useEffect(() => {
		async function loadData() {
			const persons = [];
			for (var i = 0; i < 1000; i++) {
				var person = {};
				person.name = faker.name.findName();
				person.email = faker.internet.email();
				persons.push(person);
			}
			setData(persons);
		}
		loadData();
	}, []);

	function onGridReady(params) {
		setGridApi(params.api);
	}

	const onPageSizeChanged = () => {
		const value = document.getElementById('page_size').value;
		gridApi.paginationSetPageSize(Number(value));
	};

	return (
		<div className="grid-header">
			<h1>Dynamic Grid</h1>
			<div className="paging">
				Page Size: &nbsp;
				<select onChange={() => onPageSizeChanged()} id="page_size">
					<option value="10" defaultValue={true}>10</option>
					<option value="20">20</option>
					<option value="50">50</option>
					<option value="100">100</option>
					<option value="500">500</option>
				</select>
			</div>
			<div className="ag-theme-alpine" style={{
				height: 600, marginLeft: 20, marginRight: 20, marginTop:10 }}>
				<AgGridReact
					onGridReady={onGridReady}
					rowData={data}
					columnDefs={columnDefs}
					suppressRowClickSelection={true}
					pagination={true}
					paginationPageSize={10}
					enableRangeSelection={true}
					paginationNumberFormatter={
						function(params) { return '[' + params.value.toLocaleString() + ']'; }}
					rowSelection={'multiple'}
					sizeColumnsToFit={true}
					enableCellTextSelection={true}
					isRowSelectable={
						function(rowNode) { return false; }}
				/>
			</div>
		</div>
	);
}
