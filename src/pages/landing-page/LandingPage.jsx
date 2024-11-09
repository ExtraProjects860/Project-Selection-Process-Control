import React from 'react';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import './LandingPage.css';
import logo from "../../assets/img/landing-page-img.svg";
import Navbar from '../../components/navbar/Navbar';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import { Image } from 'react-bootstrap';


const LandingPage = () => {
  return (
    <>
    <Navbar />
    <Container fluid>
      <section className="sobre-webcertificados my-5">
      <Row className="justify-content-center">
          <Col md={12} className="text-center">
            <Image src={logo} alt="Conheça a WebCertificados" fluid />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="text-center">Sobre a WebCertificados</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, magni nulla! 
              Autem suscipit nisi incidunt id qui enim veniam ut nesciunt quam. Magnam ad odit vitae quod earum, odio nostrum.
            </p>
          </Col>
        </Row>
      </section>

      <section className="sobre-webcertificados my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="text-center">Suporte ao candidato</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui molestias eveniet id voluptas iusto! 
              Cupiditate et quidem nobis ipsam ullam dolor blanditiis. Incidunt totam dignissimos, harum quo minus maxime quam.
            </p>
          </Col>
        </Row>
      </section>

      <section className="suporte-candidato my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="text-center">FAQ's</h2>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Where does it come from?</Accordion.Header>
                <Accordion.Body>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt...
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Another Question</Accordion.Header>
                <Accordion.Body>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt...
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </section>

      <section className="contato my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="text-center">Contato</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam quibusdam totam earum veniam, 
              eius quia, laboriosam odio sapiente delectus suscipit cupiditate eos eum, error animi iusto in! Neque, suscipit porro.
            </p>
          </Col>
        </Row>
      </section>
    </Container>
    <footer className='footer'>
    <SocialFooter/>
    <RightsFooter/>
    </footer>
    </>
  );
};

export default LandingPage;

