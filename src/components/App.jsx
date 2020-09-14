import React, { Component } from 'react';
import Grid from 'terra-grid';
import Button from 'terra-button';
import ContentContainer from 'terra-content-container';
import Card from 'terra-card';
import Input from 'terra-form-input';
import Spacer from 'terra-spacer';
import Textarea from 'terra-form-textarea';
import Pharmacy from '../model/pharmacy';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      closestPharmData: undefined,
    }

    this.getClosestPharm = this.getClosestPharm.bind(this);
  }

  getClosestPharm() {
    // will not work with values with e, Euler's number - but lat and long should not have this - a user could still type it in.
    const lat1 = document.getElementById('latitude-input').value;
    const long1 = document.getElementById('longitude-input').value;
    const options = {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000',
      },
    };

    if (lat1 && long1) {
      fetch(`http://localhost:3001/pharmacy?latitude=${lat1}&longitude=${long1}`, options)
      .then(resp => resp.json())
      .then(data => {
        const pharmacy = new Pharmacy(data.pharmacy, data.distance);
        this.setState({ closestPharmData: pharmacy });
      })
      .catch((error) => {
        console.log(error);
        window.alert('An error occured while getting the closet pharmacy, please try again.');
      });
    } else {
      window.alert("Latitude and Longitude must be put in before finding closest Pharmacy")
    }
  }

  render() {
    const {
      latitude, longitude, closestPharmData
    } = this.state;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column enormous={4} huge={4} large={3} medium={2} small={1} tiny={0} />
          <Grid.Column enormous={4} huge={4} large={6} medium={8} small={10} tiny={12}>
            <Card>
              <ContentContainer
                fill={false}
                header={
                  <h3 id="header">Rx Soultion Test Closest Pharmacy</h3>
                }
                footer={false}
              >
                <ol>
                  <li>Type in a given latitude and longitude</li>
                  <Spacer marginTop="large+1"  marginBottom="large+1">
                    <p>Your Latitude: </p>
                    <Input
                      id="latitude-input"
                      type="number"
                      name="Your Latitude:"
                      value={latitude}
                    />
                    <p>Your Longitude: </p>
                    <Input
                      id="longitude-input"
                      type="number"
                      name="Your Longitude:"
                      value={longitude}
                    />
                  </Spacer>
                  <li>Use location to find closest Pharmacy</li>
                  <Spacer marginTop="large+1"  marginBottom="large+1">
                    <Button text="Get Closest Pharmacy" variant="emphasis" onClick={this.getClosestPharm} />
                    <p>You closest Pharmacy is:</p>
                    <Textarea
                      id="pharmacy-input"
                      size="medium"
                      disabled={true}
                      value={closestPharmData}
                    />
                  </Spacer>
                </ol>
              </ContentContainer>
            </Card>
          </Grid.Column>
          <Grid.Column enormous={4} huge={4} large={3} medium={2} small={1} tiny={0} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
