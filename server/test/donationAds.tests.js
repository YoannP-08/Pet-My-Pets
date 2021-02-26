const fs = require('fs');
let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = 'http://localhost:4000/api/';



//Assertion configuration
chai.should()

chai.use(chaiHTTP);

// TESTS

describe('Donation CRUD test', () => {
    let id = "";
    let id2 = "";
    let userId = "";
    let idAdmin = ""
    let token = "";
    let tokenAdmin = ""

    //User for test
    // ADMIN User
    describe('POST Create User Admin /api/users/signup', () => {
        it('should create a new admin User', function (done) {
            let user = {
                lastname: "Quentin",
                firstname: "admin",
                username: "quentinadmin",
                email: "admin2@gmail.com",
                password: "azertyuiop",
                address: "10 rue test",
                zipCode: "75020",
                city: "Paris",
                isAdmin: true
            };

            chai.request(server)
                .post("users/signup/")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.nested.property('user.firstname').eq('admin');
                    res.body.should.have.nested.property('user.lastname').eq('Quentin');
                    res.body.should.have.nested.property('user.username').eq('quentinadmin');
                    res.body.should.have.nested.property('user.email').eq('admin2@gmail.com');
                    res.body.should.have.nested.property('user.password');
                    res.body.should.have.nested.property('user.address').eq('10 rue test');
                    res.body.should.have.nested.property('user.zipCode').eq('75020');
                    res.body.should.have.nested.property('user.city').eq('Paris');
                    res.body.should.have.nested.property('user.isAdmin').eq(true);
                    idAdmin = res.body.user.id;
                    tokenAdmin = res.body.token;
                    done();
                })
        });
    })

    // User not admin
    describe('POST Create User /api/users/signup', () => {
        it('should create a new User', function (done) {
            let user = {
                lastname: "Quentin",
                firstname: "test",
                username: "testquentin",
                email: "quentin2@gmail.com",
                password: "azertyuiop",
                address: "10 rue test",
                zipCode: "75020",
                city: "Paris",
            };

            chai.request(server)
                .post("users/signup/")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.nested.property('user.lastname').eq('Quentin');
                    res.body.should.have.nested.property('user.firstname').eq('test');
                    res.body.should.have.nested.property('user.username').eq('testquentin');
                    res.body.should.have.nested.property('user.email').eq('quentin2@gmail.com');
                    res.body.should.have.nested.property('user.password');
                    res.body.should.have.nested.property('user.address').eq('10 rue test');
                    res.body.should.have.nested.property('user.zipCode').eq('75020');
                    res.body.should.have.nested.property('user.city').eq('Paris');
                    userId = res.body.user.id;
                    token = res.body.token;
                    done();
                })
        });
    })

    /**
     * Test the GET route
     * */
    describe("GET all donationAds /api/donationAds", () => {
        it('should return all donationAds data', function (done){
            chai.request(server)
                .get("donationads/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
    })

   /**
     * Test the POST route
     * */
    describe("Post without User /api/donationads", () => {
        it('Should not be possible', function (done) {
            const donationAd = {
                description: "Joli chien à troquer ou donner",
                zipCode: "78580",
                user_id: userId,
                animalType: "Chien"
            }
            chai.request(server)
                .post("donationads/")
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(donationAd)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.be.a('object');
                    res.body.should.have.property('msg').eq("No token, authorization denied");
                    done();
                })
        })
    })

    describe("Post with User /api/donationads", () => {
        it('Should return the new donationAd created by user', function (done) {
            const donationAd = {
                title: 'Chihuahua',
                description: "Joli chien à troquer ou donner",
                zipCode: "78580",
                user_id: userId,
                animalType: "Chien"
            }
            chai.request(server)
                .post("donationads/")
                .set('x-auth-token', token)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(donationAd)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.description').eq("Joli chien à troquer ou donner");
                    res.body.should.have.nested.property('data.animalType').eq("Chien");
                    res.body.should.have.nested.property('data.zipCode').eq("78580");
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property('data.photo.data.type').eq("Buffer");
                    id = res.body.data._id;
                    done();
                })
        })
    })

    //POST WITH ADMIN
    describe("Post with Admin /api/donationads", () => {
        it('Should return the new donationAd created by Admin', function (done) {
            const donationAd = {
                title: 'Chihuahua',
                description: "Joli chien à troquer ou donner",
                zipCode: "78580",
                user_id: idAdmin,
                animalType: "Chien"
            }
            chai.request(server)
                .post("donationads/")
                .set('x-auth-token', tokenAdmin)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(donationAd)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.description').eq("Joli chien à troquer ou donner");
                    res.body.should.have.nested.property('data.animalType').eq("Chien");
                    res.body.should.have.nested.property('data.zipCode').eq("78580");
                    res.body.should.have.nested.property('data.user_id').eq(idAdmin);
                    res.body.should.have.nested.property('data.photo.data.type').eq("Buffer");
                    id2 = res.body.data._id;
                    done();
                })
        })
    })


    //GET by ID
    describe("Get by ID /api/donationad", () => {
        it('should return one donationad', function (done){
            chai.request(server)
                .get("donationads/" + id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.nested.property('data._id').eq(id);
                    res.body.should.have.nested.property('data.description').eq("Joli chien à troquer ou donner");
                    res.body.should.have.nested.property('data.animalType').eq("Chien");
                    res.body.should.have.nested.property('data.zipCode').eq("78580");
                    res.body.should.have.nested.property('data.user_id._id').eq(userId);
                    res.body.should.have.nested.property('data.photo.data.type').eq("Buffer");
                    done();
                })
        })
    })

    //PUT without token
    describe('PUT without User /api/donationads/:id', () => {
        it('should not modify a donationAd', function (done){
            const newDonationAd = {
                description: "joli chien à troquer",
                zipCode: "78580",
            };
            chai.request(server)
                .put("donationAds/" + id)
                .send(newDonationAd)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.nested.property("msg").eq("No token, authorization denied")
                    done();
                })
        })
    })

    //PUT with User
    describe('PUT with User /api/donationads/:id', () => {
        it('should modify a donationAd by User', function (done){
            const newDonationAd = {
                description: "joli chiwawa à troquer",
                zipCode: "78000",
            };
            chai.request(server)
                .put("donationAds/" + id)
                .set('x-auth-token', token)
                .send(newDonationAd)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.nested.property("data._id").eq(id)
                    res.body.should.have.nested.property('data.description').eq('joli chiwawa à troquer');
                    res.body.should.have.nested.property('data.zipCode').eq('78000');
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property('data.photo.data');
                    done();
                })
        })
    })

    //PUT with User on another donationAd
    describe('PUT with User on Admin donationAd /api/donationads/:id', () => {
        it('should not modify a donationAd', function (done){
            const newDonationAd = {
                description: "joli chaton à troquer",
                zipCode: "78580",
            };
            chai.request(server)
                .put("donationAds/" + id2)
                .set('x-auth-token', token)
                .send(newDonationAd)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.nested.property("message").eq('This request is unauthorized')
                    done();
                })
        })
    })

    //PUT Admin
    describe('PUT with Admin /api/donationads/:id', () => {
        it('should modify a donationAd', function (done){
            const newDonationAd = {
                description: "joli perroquet à échanger",
                zipCode: "75000",
            };
            chai.request(server)
                .put("donationAds/" + id2)
                .set('x-auth-token', tokenAdmin)
                .send(newDonationAd)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.nested.property("data._id").eq(id2)
                    res.body.should.have.nested.property('data.description').eq('joli perroquet à échanger');
                    res.body.should.have.nested.property('data.zipCode').eq('75000');
                    res.body.should.have.nested.property('data.user_id').eq(idAdmin);
                    res.body.should.have.nested.property('data.photo.data');
                    done();
                })
        })
    })

    //PUT Admin on User donationAD
    describe('PUT with Admin on user DonationAd /api/donationads/:id', () => {
        it('should modify a donationAd', function (done){
            const newDonationAd = {
                description: "joli lion à échanger",
                zipCode: "51000",
            };
            chai.request(server)
                .put("donationAds/" + id)
                .set('x-auth-token', tokenAdmin)
                .send(newDonationAd)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.nested.property("data._id").eq(id)
                    res.body.should.have.nested.property('data.description').eq('joli lion à échanger');
                    res.body.should.have.nested.property('data.zipCode').eq('51000');
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property('data.photo.data');
                    done();
                })
        })
    })

    //DELETE
    describe('DELETE donationAd without User /api/donationads', () => {
        it('should not delete donationad', function (done) {
            chai.request(server)
                .delete("donationads/" + id)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('msg').eq("No token, authorization denied");
                    done();
                })
        })
    })

    describe('DELETE donationAd with User /api/donationads', () => {
        it('should delete donationad by user', function (done) {
            chai.request(server)
                .delete("donationads/" + id)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eq('Donation Ads Deleted');
                    done();
                })
        })
    })

    describe('DELETE Admin donationAd with User /api/donationads', () => {
        it('should not delete donationad', function (done) {
            chai.request(server)
                .delete("donationads/" + id2)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.property('message').eq('This request is unauthorized');
                    done();
                })
        })
    })

    //DELETE Admin
    describe('DELETE donationAd with Admin /api/donationads', () => {
        it('should delete donationad by Admin', function (done) {
            chai.request(server)
                .delete("donationads/" + id2)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eq('Donation Ads Deleted');
                    done();
                })
        })
    })


    describe("DELETE User by User /api/users/:id", () => {
        it("should delete a user", function (done) {
            chai.request(server)
                .delete("users/" + userId)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                })
        })
    })

    describe("DELETE Admin by Admin /api/users/:id", () => {
        it("should delete a admin user", function (done) {
            chai.request(server)
                .delete("users/" + idAdmin)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                })
        })
    })

})
