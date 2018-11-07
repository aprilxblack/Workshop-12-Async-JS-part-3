var chai = require('chai')
var expect = chai.expect
var supertest = require('supertest');

var api = supertest('http://todos.demo.rootpath.io')

var body;

//not working at all for some reason, always getting timeout no matter what
describe('GET /todos', function(){
    it('returns a 200 status code', function(done){
        api
        .get('/todos/')
        .expect(200)
        .end(done)
    })
})

//these things keep failing and passing randomly because poor internet connection :/
describe('GET /todos/<id>', function(){
    it('should return the fact with id 14778', function(done){
        api
        .get('/todos/14778')
        .expect({
            due: "1999-04-11T00:00:00.000Z",
            notes: "",
            id: 14778,
            title: "Go on a Lord of the Rings tour in New Zealand"
        })
        .end(done)
    })
    it('should return a 404 for non-existent item', function(done){
        api
        .get('/todos/1')
        .expect(404)
        .end(done)
    })
    it('should throw a 404 for getting item with negative ID', function(done){
        api
        .get('/todos/-69')
        .expect(404)
        .end(done)
    })
    it('should throw a 404 for getting an item with ID that is not a number', function(done){
        api
        .get('/todos/xD')
        .expect(404)
        .end(done)
    })
})

describe('POST', function(){
    it('should create a todo correctly', function(done){
        api
        .post('/todos?title=KarolinaTest2&due=2018-11-07')
        .expect(function(response){
            expect(201) // 'created'
            body = response.body
        })
        .end(done)
    })
    //this isn't really a test for the 'POST' method, but it's checking if it works, so I decided to put it here
    it('this newly created todo should be there', function(done){
        api
        .get('/todos/' + body.id)
        .expect(200)
        .end(done)
    })
    it('should throw 422 for trying to create a todo without params', function(done){
        api
        .post('/todos')
        .expect(422) //unprocessable entity
        .end(done)
    })
    it('should throw 405 for trying to create a todo inside of a todo', function(done){
        api
        .post('/todos/14778')
        .expect(405)
        .end(done)
    })
    it('should throw a 422 for trying to create a todo with nonsense date', function(done){
        api
        .post('/todos?title=KarolinaTest3&due=13-13-2013')
        .expect(422) //unprocessable entity
        .end(done)
    })
})

describe('PUT todos', function(){
    it('should throw a 405 for trying to update a collection', function(done){
        api
        .put('/todos')
        .expect(405)
        .end(done)
    })
})

describe('PUT todos/<id', function(){
    it('should update a todo with id 66666', function(done){
        api
        .put('/todos/66666?title=newTitle&due=2018-11-07&notes=someNotes')
        .expect({
            due: "2018-11-07",
            notes: "someNotes",
            id: 66666,
            title: "newTitle"
        })
        .end(done)
    })
    it('should throw 404 for trying to update something that does not exist', function(done){
        api
        .put('/todos/1?title=title&due=2010-10-10&notes=notes')
        .expect(404)
        .end(done)
    })
    it('should throw 404 for trying to update a todo with nonsense ID', function(done){
        api
        .put('/todos/trolololo?title=title&due=2010-10-10&notes=notes')
        .expect(404)
        .end(done)
    })
    it('should throw 422 for trying to update a todo without passing params', function(done){
        api
        .put('/todos/66666')
        .expect(422)
        .end(done)
    })
})

describe('PATCH', function(){
    it('should correctly patch an item with ID 66666', function(done){
        api
        .patch('/todos/66666?title=brandNewTitle')
        .expect({
            due: "2018-11-07",
            notes: "someNotes",
            id: 66666,
            title: "brandNewTitle"
        })
    })
    it('should throw 404 for patching non-existent item', function(done){
        api
        .patch('/todos/00000?title=newTitle')
        .expect(404) //got 200 OK for that???? wtf what do you mean OK
        .end(done)
    })
    it('should throw 405 for patching a collection', function(done){
        api
        .patch('/todos') //this is also OK I don't even know
        .expect(405)
        .end(done)
    })
})

describe('DELETE /todos', function(){
    it('should throw 405 for trying to delete a collection', function(done){
        api
        .delete('/todos')
        .expect(405)
        .end(done)
    })
})

describe('DELETE /todos/<id>', function(){
    it('should properly delete an item that we created previously', function(done){
        api
        .delete('/todos/' + body.id)
        .expect(204) // 'no content' - success message for deleting
        .end(done)
    })
    it('should throw 404 for trying to delete a non-existant item', function(done){
        api
        .delete('/todos/1234567890')
        .expect(404)
        .end(done)
    })
})
