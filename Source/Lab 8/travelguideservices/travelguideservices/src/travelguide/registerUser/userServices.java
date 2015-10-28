package travelguide.registerUser;
import java.io.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bson.Document;
import org.json.JSONObject;
import com.mongodb.*;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.DBCollection;
import com.mongodb.*;
import org.json.simple.JSONObject;
import com.mongodb.util.JSON;


/**
 * Servlet implementation class registerUser
 */

@WebServlet("/userServices")
public class userServices extends HttpServlet {
	private static final long serialVersionUID = 1L;
	  
	   //other registrations omitted for brevity
    /**
     * @see HttpServlet#HttpServlet()
     */
    public userServices() {
        super();
        //register(CORSResponseFilter.class);
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
//		response.getWriter().append("Served at: ").append(request.getContextPath());
		MongoClientURI uri = new MongoClientURI("mongodb://root:password@ds053080.mongolab.com:53080/userlogs");
		MongoClient client = new MongoClient(uri);
		DB db = client.getDB(uri.getDatabase());
		DBCollection usersList = db.getCollection("users");
		String userNameToFetch=request.getParameter("userName");
		String password=request.getParameter("pwd");
		BasicDBObject andQuery = new BasicDBObject();
		List<BasicDBObject> obj = new ArrayList<BasicDBObject>();
		obj.add(new BasicDBObject("userName",userNameToFetch));
		obj.add(new BasicDBObject("pwd",password));
		andQuery.put("$and",obj);
		DBObject user= usersList.findOne(andQuery);
		response.setHeader("Access-Control-Allow-Origin","*");
		response.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,PUT");
		response.setHeader("Access-Control-Allow-Headers","Content-Type");
		response.setHeader("Access-Control-Max-Age","86400");
		if(user!=null)
		response.getWriter().write(user.toString());
		else 
			response.getWriter().write("Failure");
	}	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		StringBuilder buffer = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while((line=reader.readLine())!=null)
			buffer.append(line);
		String reqData = buffer.toString();
		JSONObject userToBeAdded = new JSONObject(reqData);
		BasicDBObject user = new BasicDBObject();
	
		for(Object key:userToBeAdded.keySet().toArray())
			user.put(key.toString(),userToBeAdded.get(key.toString()));
		MongoClientURI uri = new MongoClientURI("mongodb://root:password@ds053080.mongolab.com:53080/userlogs");
		MongoClient client = new MongoClient(uri);
		DB db = client.getDB(uri.getDatabase());
		DBCollection usersList = db.getCollection("users");
		WriteResult result=usersList.insert(user);
		
		response.setHeader("Access-Control-Allow-Origin","*");
		response.setHeader("Access-Control-Allow-Methods","POST");
		response.setHeader("Access-Control-Allow-Headers","Content-Type");
		response.setHeader("Access-Control-Max-Age","86400");		
		response.getWriter().write(result.toString());
	}
	

}
