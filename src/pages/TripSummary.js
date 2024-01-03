import {
    Col,
    Row,
    Typography,
} from "antd";
import CardComp from "../components/cards/cards";

function TripSummary() {

    const { Title, Text } = Typography;

    return (
        <>
            <Title level={3}>TRIP SUMMARY</Title>
            <CardComp>
                <Row gutter={[24, 0]}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24"></Col>
                </Row>
            </CardComp>
        </>
    );
}

export default TripSummary;