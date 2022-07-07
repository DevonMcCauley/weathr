import { Table } from "react-bootstrap";

const HourlyTable = (props) => {
	// Iterates through the forecast to build out each table row
	const buildRows = props.hourlyForecast.map((forecast) => {
		const forecastHour = new Date(forecast.startTime);
		let time = forecastHour.toLocaleTimeString("en-US");

		return (
			<tr>
				<td>{time}</td>
				<td>{forecast.shortForecast}</td>
				<td>{forecast.temperature}&#176;F</td>
				<td>
					{forecast.windDirection} {forecast.windSpeed}
				</td>
			</tr>
		);
	});
	return (
		<Table striped bordered hover className="mt-3">
			<thead>
				<tr>
					<th>Time</th>
					<th>Forecast</th>
					<th>Temperature</th>
					<th>Wind</th>
				</tr>
			</thead>
			<tbody>{buildRows}</tbody>
		</Table>
	);
};

export default HourlyTable;
