import React from 'react'
import { Container, Navbar } from 'react-bootstrap'


function Header() {
  return (
    <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand className='fs-4' href="/">
          <i className='fa-solid fa-layer-group me-1'></i> EMS Application
          </Navbar.Brand>
        </Container>
      </Navbar>
  )
}

export default Header