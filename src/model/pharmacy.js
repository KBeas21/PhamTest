/**
 * Used as a DTO for our DB Pharmacy object
 */
class Pharmacy {
  constructor(pharmacy, distance) {
    this._id = pharmacy._id;
    this.address = pharmacy.address;
    this.city = pharmacy.city;
    this.state = pharmacy.state;
    this.zip = pharmacy.zip;
    this.distance = distance;
    this.latitude = pharmacy.latitude;
    this.longitude = pharmacy.longitude;
    this.name = pharmacy.name;
  }

  getAddress() {
    return this.address;
  }

  getCity() {
    return this.city;
  }

  getState() {
    return this.state;
  }

  getZip() {
    return this.zip;
  }

  getDistance() {
    return this.distance;
  }

  toString() {
    return `Name: ${this.name}\nAddress: ${this.address}, ${this.city}, ${this.state} ${this.zip}\nDistance (in miles): ${this.distance}`
  }
}

export default Pharmacy;
