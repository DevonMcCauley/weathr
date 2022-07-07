import { useState } from "react";
import CoordinateForm from "./CoordinateForm";
import axios from "axios";
import Forecast from "./Forecast";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Row } from "react-bootstrap";
import HourlyTable from "./HourlyTable";

// TODO: Likely refactor to use React context
function App() {
	const [forecast, setForecast] = useState([]);
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [city, setCity] = useState("");
	const [daily, setDaily] = useState(true);
	const [hourlyForecast, setHourlyForecast] = useState([]);

	// Makes REST call to get the office and grid points
	const submitCoordinates = async (event) => {
		event.preventDefault();

		const url = `https://api.weather.gov/points/${latitude},${longitude}`;
		let response = await axios({
			method: "GET",
			url: url,
		});

		const office = response.data.properties.gridId;
		const gridX = response.data.properties.gridX;
		const gridY = response.data.properties.gridY;
		getForecast(office, gridX, gridY);
	};

	// Uses the office and grid points to get the forecast
	const getForecast = async (office, gridX, gridY) => {
		let url = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`;
		let response = await axios({
			method: "GET",
			url: url,
		});
		setForecast(response.data.properties.periods);
		getForecastHourly(office, gridX, gridY);
		getCity();
	};

	// Uses the office and grid points to get the HOURLY forecast
	const getForecastHourly = async (office, gridX, gridY) => {
		const url = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast/hourly`;
		const response = await axios({
			method: "GET",
			url: url,
		});
		const returnedHours = response.data.properties.periods;
		// Ensures that only the next 24 hours are displayed
		let oneDayForecast = returnedHours.slice(0, 24);
		setHourlyForecast(oneDayForecast);
	};

	// Makes a REST call to bigdatacloud.net to get the user's city from their latitude/longitude
	const getCity = async () => {
		const response = await axios({
			method: "GET",
			url: "https://api.bigdatacloud.net/data/reverse-geocode-client",
			params: {
				latitude: latitude,
				longitude: longitude,
			},
		});
		const { data } = response;
		let city = `${data.locality}, ${data.principalSubdivision}`;
		setCity(city);
	};

	// Used to detect the user's location and set the Latitude and Longitude states
	const getLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			setLatitude(position.coords.latitude);
			setLongitude(position.coords.longitude);
		});
	};

	// Toggles the daily vs hourly switch
	const handleSwitchChange = () => {
		setDaily(!daily);
	};

	// Outputs the user's current city
	const cityDiv = <div className="mt-3 fs-5">{city}</div>;

	// Toggles a message to the user displaying which type of forecast they are viewing (Daily vs Hourly)
	const dailyDiv = <div>Daily</div>;
	const hourlyDiv = <div>Hourly</div>;

	return (
		<Container className="text-center">
			<Row className="mt-4">
				{/* Renders the Coordinate input elements */}
				<CoordinateForm
					onSubmit={submitCoordinates}
					latitude={latitude}
					longitude={longitude}
					getLocation={getLocation}
					setLatitude={setLatitude}
					setLongitude={setLongitude}
				/>
			</Row>
			<div className="mt-3">
				<Form.Switch
					type="switch"
					id="daily-switch"
					checked={daily}
					onChange={handleSwitchChange}
				/>
			</div>
			{daily && dailyDiv}
			{!daily && hourlyDiv}
			{city && cityDiv}

			{daily && <Forecast forecast={forecast} daily={daily} />}
			{!daily && <HourlyTable hourlyForecast={hourlyForecast} />}
		</Container>
	);
}
export default App;
