import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
const Customer = require('../app/models/customer');
const CustomerAddress = require('../app/models/customeraddress');

chai.use(chaiHttp);
chai.should();

describe('Customers', () => {
  const myServer = chai.request(server);
  beforeEach((done) => {
    let customers = [
      {_id: 1, name: 'Ryan'},
      {_id: 2, name: 'Jonathan'},
      {_id: 3, name: 'Colin'},
      {_id: 4, name: 'Hank'},
    ];
    let addresses = [
      {_id: 1, customer: 2, street_address: '123 Big Walk Way',
        postal_code: 75023, country: 'US'},
      {_id: 2, customer: 3, street_address: '509 Charter Road',
        postal_code: 90021, country: 'US'},
      {_id: 3, customer: 1, street_address: '999 Night Stalker road',
        postal_code: 12345, country: 'US'},
      {_id: 4, customer: 4, street_address: null,
        postal_code: 12345, country: 'US'},
    ];
    Promise.all([
      Customer.remove({}),
      CustomerAddress.remove({}),
    ])
      .then(() => (
        Promise.all([
            Customer.insertMany(customers),
            CustomerAddress.insertMany(addresses)])
      ))
      .then(() => done());
    });
 /*
  * Test the /GET route
  */
  describe('/GET customer', () => {
    it('it should GET all customers having address', (done) => {
      myServer.get('/customer')
          .then((res) => {
            const customers = res.body;
            customers.should.be.a('array');
            customers.length.should.be.eql(3);
            done();
          });
    });
  });

  describe('/POST customer', () => {
    it('should post customer', (done) => {
    const address = {
      street_address: '123 Foo', postal_code: 75023, country: 'US'};
    const customer = {name: 'Ted', address};
    chai.request(server)
      .post('/customer')
      .send(customer)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.customer.customer.should.have.property('name');
        res.body.customer.should.have.property('street_address');
        res.body.customer.should.have.property('postal_code');
        res.body.customer.should.have.property('country');
        done();
      })
      .catch((e) => console.warn(e));
    });
  });
 /*
  * Test the /GET/:id route
  */
  describe('/GET/:id book', () => {
    it('it should GET a book by the given id', (done) => {
      chai.request(server)
        .get('/customer/1')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('customer');
          res.body.should.have.property('street_address');
          res.body.should.have.property('postal_code');
          res.body.should.have.property('country');
          done();
      });
    });
  });
 /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id customer', () => {
    it('it should UPDATE a customer given the id', (done) => {
      chai.request(server)
        .put('/customer/1')
        .send({name: 'foo', address: {street_address: 'bar'}})
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Customer updated!');
          res.body.customer.customer.name.should.eq('foo');
          res.body.customer.street_address.should.eq('bar');
          done();
        });
    });
  });
 /*
  * Test the /customer/:id route
  */
  describe('/DELETE/:id book', () => {
    it('it should DELETE a customer given the id', (done) => {
      chai.request(server)
        .delete('/customer/1')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message')
            .eql('Customer successfully deleted!');
          res.body.result.should.be.a('array');
          res.body.result[0].should.have.property('ok').eql(1);
          res.body.result[0].should.have.property('n').eql(1);
          res.body.result[1].should.have.property('ok').eql(1);
          res.body.result[1].should.have.property('n').eql(1);
          done();
        });
      });
    });
});
