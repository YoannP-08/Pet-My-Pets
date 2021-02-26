let chai = require('chai')
let chaiHTTP = require("chai-http")
let server = "http://localhost:4000/api/"
const fs = require('fs');


//Invoque Chai//
chai.should()

chai.use(chaiHTTP)

//TESTS//

describe("Keeper CRUD test", () => {
    let keeperAdId = "";
    let keeperAdId2 = "";
    let userId = "";
    let adminId = ""
    let tokenUser = "";
    let tokenAdmin = "";

    // Create A User To Test KeeperAd API
    // Non-Admin User
    describe('POST Create Non-Admin User /api/users/signup', () => {
        it('Should create a new Non-Admin User', function(done) {
            let user = {
                lastname: "Bekhtaoui",
                firstname: "Yanis",
                username: "B-Y",
                email: "notadmin1@notadmin1.com",
                password: "azertyuiop",
                address: "10 rue test",
                zipCode: "75020",
                city: "Paris",
                isAdmin: false
            };

            chai.request(server)
                .post("users/signup/")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.nested.property('user.lastname').eq('Bekhtaoui');
                    res.body.should.have.nested.property('user.firstname').eq('Yanis');
                    res.body.should.have.nested.property('user.username').eq('B-Y');
                    res.body.should.have.nested.property('user.email').eq('notadmin1@notadmin1.com');
                    res.body.should.have.nested.property('user.password');
                    res.body.should.have.nested.property('user.address').eq('10 rue test');
                    res.body.should.have.nested.property('user.zipCode').eq('75020');
                    res.body.should.have.nested.property('user.city').eq('Paris');
                    res.body.should.have.nested.property('user.isAdmin').eq(false);
                    userId = res.body.user.id;
                    tokenUser = res.body.token;
                    done();
                });
        });
    });

    // Admin User
    describe('POST Create Admin User /api/users/signup', () => {
        it('Should create a new Admin User', function(done) {
            let user = {
                lastname: "Cherniuk",
                firstname: "Marianna",
                username: "C-M-A",
                email: "admin8@admin8.com",
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
                    res.body.should.have.nested.property('user.lastname').eq('Cherniuk');
                    res.body.should.have.nested.property('user.firstname').eq('Marianna');
                    res.body.should.have.nested.property('user.username').eq('C-M-A');
                    res.body.should.have.nested.property('user.email').eq('admin8@admin8.com');
                    res.body.should.have.nested.property('user.password');
                    res.body.should.have.nested.property('user.address').eq('10 rue test');
                    res.body.should.have.nested.property('user.zipCode').eq('75020');
                    res.body.should.have.nested.property('user.city').eq('Paris');
                    res.body.should.have.nested.property('user.isAdmin').eq(true);
                    adminId = res.body.user.id;
                    tokenAdmin = res.body.token;
                    done();
                });
        });
    });

    /**
     * Test the KeeperAd GET route
     */

    describe("GET /api/keeper", () =>{
        it("Should return all keeper ads data", function(done) {
            chai.request(server)
                .get("keeperads/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    /**
     * Test the Comment POST route
     */
    // New Keepr Ad posted by Non-Admin User
    describe("POST with Non-Admin User Create a keeperAd /api/keeper/post", () => {
        it("Should create a new keeper ad", function(done) {
            const keeper = {
                user_id: userId,
                title: "super super super",
                description: "super super super doogsitter",
                start: "10/01/2021",
                end: "12/01/2021",
                animalType: "Pogona",
                zipCode: "78580"
            };
            chai.request(server)
                .post("keeperads/")
                .set('x-auth-token', tokenUser)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(keeper)
                .end((err,res) =>{
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.title').eq('super super super');
                    res.body.should.have.nested.property('data.description').eq('super super super doogsitter');
                    res.body.should.have.nested.property('data.start').eq('10/01/2021');
                    res.body.should.have.nested.property('data.end').eq('12/01/2021');
                    keeperAdId = res.body.data._id;
                    done();
                });
        });
    });

    // New Keeper Ad posted by Admin User
    describe("POST with Admin User Create a keeperAd  /api/keeper/post", () => {
        it("Should create a new keeper ad", function(done) {
            const keeper = {
                user_id: adminId,
                title: "super super super Admin",
                description: "super super super dogsitter Admin",
                start: "10/01/2021",
                end: "12/01/2021",
                animalType: "Pogona",
                zipCode: "78580"
            };
            chai.request(server)
                .post("keeperads/")
                .set('x-auth-token', tokenAdmin)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(keeper)
                .end((err, res) =>{
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.nested.property('data.user_id').eq(adminId);
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.title').eq('super super super Admin');
                    res.body.should.have.nested.property('data.description').eq('super super super dogsitter Admin');
                    res.body.should.have.nested.property('data.start').eq('10/01/2021');
                    res.body.should.have.nested.property('data.end').eq('12/01/2021');
                    keeperAdId2 = res.body.data._id;
                    done();
                });
        });
    });

    // New Keeper Ad posted by Non-Authenticated User
    describe("POST with Non-Authenticated User DONOT Create a keeperAd /api/keeper/post", () => {
        it("Should not create a new keeper ad", function(done) {
            const keeper = {
                user_id: userId,
                title: "super super super Non-Authenticated User",
                description: "super super super dogsitter Non-Authenticated User",
                start: "10/01/2021",
                end: "12/01/2021",
                animalType: "Pogona",
                zipCode: "78580"
            };
            chai.request(server)
                .post("keeperads/")
                .send(keeper)
                .end((err, res) =>{
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eq("No token, authorization denied");
                    done();
                });
        });
    });


    /**
     * Test the KeeperAd GET by ID route with the new ID from the last KeeperAd POST
     * REQUEST. This may not be the best way to do it, but it makes the tests
     * independents from the actual infos of the DB
     */

    describe("GET by ID /api/keeper",() =>{
        it("Should return one keeper", function (done){
            chai.request(server)
                .get("keeperads/" + keeperAdId)
                .end((err,res) =>{
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.nested.property('data.user_id._id').eq(userId)
                    res.body.should.have.nested.property("data._id").eq(keeperAdId)
                    res.body.should.have.nested.property("data.title").eq("super super super")
                    res.body.should.have.nested.property("data.description").eq("super super super doogsitter")
                    res.body.should.have.nested.property("data.start").eq("10/01/2021")
                    res.body.should.have.nested.property("data.end").eq("12/01/2021")
                    done()
                });
        });
    });

    /**
     * Test the Keeper Ad PUT route
     * */
    // Edit keeperAd by Non-Admin User
    describe("PUT by ID /api/keeper/update", () => {
        it("Should return updated keeper", function(done) {
            const updateKeeper = {
                user_id: userId,
                title: "super super super",
                description: "super super super doogsitter",
                start: "10/01/2021",
                end: "12/01/2021",
                animalType: "Pogona",
                zipCode: "78580"
            };
            chai.request(server)
                .put("keeperads/" + keeperAdId)
                .set('x-auth-token', tokenUser)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(updateKeeper)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.nested.property("data._id").eq(keeperAdId);
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property("data.title").eq("super super super");
                    res.body.should.have.nested.property("data.description").eq("super super super doogsitter");
                    res.body.should.have.nested.property("data.start").eq("10/01/2021");
                    res.body.should.have.nested.property("data.end").eq("12/01/2021");
                    done();
                });
        });
    });

    // Edit keeperAd by Admin User
    describe("PUT by ID /api/keeper/update", () => {
        it("Should return updated keeper", function(done) {
            const updateKeeper = {
                user_id: adminId,
                title: "Edit super super super Admin",
                description: "Edit super super super dogsitter Admin",
                start: "10/01/2021",
                end: "12/01/2021",
                animalType: "Pogona",
                zipCode: "78580"
            };
            chai.request(server)
                .put("keeperads/" + keeperAdId2)
                .set('x-auth-token', tokenAdmin)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(updateKeeper)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.nested.property("data._id").eq(keeperAdId2);
                    res.body.should.have.nested.property('data.user_id').eq(adminId);
                    res.body.should.have.nested.property("data.title").eq("Edit super super super Admin");
                    res.body.should.have.nested.property("data.description").eq("Edit super super super dogsitter Admin");
                    res.body.should.have.nested.property("data.start").eq("10/01/2021");
                    res.body.should.have.nested.property("data.end").eq("12/01/2021");
                    done();
                });
        });
    });

    // Edit Admin keeperAd by Another User
    describe("PUT Admin keeper ad by Another User /api/keeper/update", () => {
        it("Should not return updated keeper", function(done) {
            const updateKeeper = {
                user_id: adminId,
                title: "Edit super super super Admin",
                description: "Edit super super super dogsitter Admin",
                start: "10/01/2021",
                end: "12/01/2021",
                animalType: "Pogona",
                zipCode: "78580"
            };
            chai.request(server)
                .put("keeperads/" + keeperAdId2)
                .set('x-auth-token', tokenUser)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(updateKeeper)
                .end((err,res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eq('This request is unauthorized');
                    done();
                });
        });
    });

    // Edit keeperAd by Non-Authenticated User
    describe("PUT Non-Authenticated User /api/keeper/update", () => {
        it("Should not return updated keeper", function(done) {
            const updateKeeper = {
                user_id: userId,
                title: "Edit super super super by non-authenticated user",
                description: "Edit super super super doogsitter by non-authenticated user",
                start: "10/01/2021",
                end: "12/01/2021",
                animalType: "Pogona",
                zipCode: "78580"
            };
            chai.request(server)
                .put("keeperads/" + keeperAdId)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(updateKeeper)
                .end((err,res) =>{
                    res.should.have.status(401);
                    res.body.should.be.a("object");
                    res.body.should.have.property('msg').eq('No token, authorization denied');
                    done();
                });
        });
    });

    // Edit User keeperAd by Admin User
    describe("PUT by ID /api/keeper/update", () => {
        it("Should return updated keeper", function(done) {
            const updateKeeper = {
                user_id: userId,
                title: "Edit User keeperAd super super super by Admin",
                description: "Edit User content super super super doogsitter by Admin",
                start: "10/01/2021",
                end: "12/01/2021",
                animalType: "Pogona",
                zipCode: "78580"
            };
            chai.request(server)
                .put("keeperads/" + keeperAdId)
                .set('x-auth-token', tokenAdmin)
                .attach('photo', fs.readFileSync('./uploads/photo.jpeg'), 'photo.jpeg')
                .field(updateKeeper)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.nested.property("data._id").eq(keeperAdId);
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property("data.title").eq("Edit User keeperAd super super super by Admin");
                    res.body.should.have.nested.property("data.description").eq("Edit User content super super super doogsitter by Admin");
                    res.body.should.have.nested.property("data.start").eq("10/01/2021");
                    res.body.should.have.nested.property("data.end").eq("12/01/2021");
                    done();
                });
        });
    });


    /**
     * Test the Comment DELETE route
     * */
    // Delete keeperAd by Non-Admin User
    describe("DELETE User Keeper Ad /api/keeper/delete", () => {
        it("Should delete keeper ad", function(done) {
            chai.request(server)
                .delete("keeperads/" + keeperAdId)
                .set('x-auth-token', tokenUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("The ad was deleted successfully");
                    done();
                });
        });
    });

    // Delete keeperAd by Non-Authenticated User
    describe("DELETE /api/keeper/delete", () => {
        it("Should not delete keeper ad", function(done) {
            chai.request(server)
                .delete("keeperads/" + keeperAdId2)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('msg').eq('No token, authorization denied');
                    done();
                });
        });
    });

    // Delete Admin keeperAd by Another User
    describe("DELETE Admin keeperAd by Another User /api/keeper/delete", () => {
        it("Should not delete keeper ad", function(done) {
            chai.request(server)
                .delete("keeperads/" + keeperAdId2)
                .set('x-auth-token', tokenUser)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.property('message').eq('Unauthorized');
                    done();
                });
        });
    });

    // Delete keeperAd by Admin User
    describe("DELETE Admin keeperAd /api/keeper/delete", () => {
        it("Should delete keeper ad", function(done) {
            chai.request(server)
                .delete("keeperads/" + keeperAdId2)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("The ad was deleted successfully");
                    done();
                });
        });
    });

    // Delete a USER when Comments API tests are done
    // Delete Non-Admin User
    describe("DELETE Non-Admin User /api/users/:id", () => {
        it("Should delete a non-admin user", function(done) {
            chai.request(server)
                .delete("users/" + userId)
                .set('x-auth-token', tokenUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                });
        });
    });

    // Delete Admin User
    describe("DELETE Admin /api/users/:id", () => {
        it("Should delete a admin user", function(done) {
            chai.request(server)
                .delete("users/" + adminId)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                });
        });
    });


})
