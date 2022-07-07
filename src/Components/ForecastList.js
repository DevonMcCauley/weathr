import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ForecastList = (props) => {
	const { forecast } = props;
	if (forecast.length < 1) {
		return (
			<div>
				Nothing yet <i className="bi bi-tornado"></i> Try entering some
				coordinates!
			</div>
		);
	}

	// Iterates through the returned forecast objects to build the display cards
	const forecastList = forecast.map((forecast) => {
		return (
			<Col key={forecast.number}>
				<Card style={{ height: "250px" }} border="primary" bg="gray900">
					<Card.Body>
						<Card.Title>
							{forecast.name || `Hour ${forecast.number}`}
						</Card.Title>
						{forecast.temperature}&#176;{forecast.temperatureUnit}
						<br />
						Wind {forecast.windDirection} {forecast.windSpeed}
						<br />
						<hr />
						{forecast.shortForecast}
					</Card.Body>
				</Card>
			</Col>
		);
	});
	return (
		<Row xs={1} md={2} lg={3} className="g-4 ms-1">
			{forecastList}
		</Row>
	);
};

export default ForecastList;
