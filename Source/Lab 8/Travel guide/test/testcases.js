var should=require('chai').should(),
    expect=require('chai').expect,
    assert=require('chai').assert,
    supertest=require('supertest'),
    api=supertest('https://api.mongolab.com/api/1/databases');
describe('LoginControl test cases', function(){
    var usersCount;
   
    
    it("Should return the number of users present in the DB before insertion", function(result){
   api.get('/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs').set('Accept','application/json').expect(200).end(function(err, resp){
            usersCount=resp.body.length;
            result();
        })
    });
    it('Should create a registered user record to the DB',function(result){
     api.post('/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs').set('Accept','application/json').send(
         {
            name:"John Doe",
        userName:"dummyUser@gmail.com",
        pwd:"password",
        mobile:"9874561230"
         }).expect(200).end(function(error,resp){
     expect(resp.body.name).to.equal('John Doe');
         expect(resp.body.userName).to.equal('dummyUser@gmail.com');
         expect(resp.body.pwd).to.equal('password');
         expect(resp.body.mobile).to.equal('9874561230');
         result();
     });
     
    });
     it('Should check if the count of users has increased in the DB',function(result){
        api.get('/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs').set('Accept','application/json').expect(200).end(function(err, resp){
            usersList=resp.body;
            assert.lengthOf(resp.body, usersCount+1,'The number of users in the DB are');
            result();
        })
    });

})

describe("Task controller test cases",function(){
     var userTaskCount;
    it("Should check for the tasks for a user", function(result){
    api.get('/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs').set('Accept','application/json').expect(200).end(function(err,resp){
    userTaskCount=resp.body.length;
        result();
    })
    });
    
    it("Should add a task to the DB",function(result){
    api.post('/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs').set('Accept','application/json').send({
    title: "Test task",
        descp:"This task was created for testing",
        count:(userTaskCount+1)
    }).expect(200).end(function(err,resp){
    expect(resp.body.title).to.equal('Test task');
        expect(resp.body.descp).to.equal('This task was created for testing');
        result();
    })
    });
    
    it("Should check if the count of the user tasks has increased in the DB",function (result){
       api.get('/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs').set('Accept','application/json').expect(200).end(function(err,resp){
    assert.lengthOf(resp.body,userTaskCount+1, "The count of the user tasks has increased by 1");
        result();
    })
    });
});
