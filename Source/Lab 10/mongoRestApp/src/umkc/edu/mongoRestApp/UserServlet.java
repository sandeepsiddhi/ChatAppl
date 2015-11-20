package umkc.edu.mongoRestApp;

import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.ibm.json.java.*;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.WriteResult;



///** Servlet implementation class userServlet**/
@WebServlet("/UserServlet")
public class UserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
		
		protected void doGet(HttpServletRequest request, HttpServletResponse response)
				throws ServletException, IOException {
			
			MongoClientURI uri = new MongoClientURI("mongodb://hr:hr@ds053080.mongolab.com:53080/userlogs");
			MongoClient client = new MongoClient(uri);

			DB db = client.getDB(uri.getDatabase());
			DBCollection users = db.getCollection("users");
			BasicDBObject query = new BasicDBObject();
			query.put("name", request.getParameter("name"));
			query.put("password", request.getParameter("password"));
			DBCursor docs = users.find(query);
			response.getWriter().write(docs.toArray().toString());
			
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.setHeader("Access-Control-Allow-Methods", "GET");
			response.setHeader("Access-Control-Allow-Headers", "Content-Type");
			response.setHeader("Access-Control-Max-Age", "86400");
		}
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
		protected void doPost(HttpServletRequest request, HttpServletResponse response)
				throws ServletException, IOException {
			// TODO Auto-generated method stub
			StringBuilder buffer = new StringBuilder();
			BufferedReader reader = request.getReader();
			String line;
			while ((line = reader.readLine()) != null) {
				buffer.append(line);
			}
			String data = buffer.toString();
			System.out.println(data);

			JSONObject params = (JSONObject) JSON.parse(data);
			BasicDBObject user1 = new BasicDBObject(params);
			
			for(Object key : params.keySet().toArray()) {
				user1.put(key.toString(), params.get(key));
			}
			
			System.out.println(user1.toJson());
			
			MongoClientURI uri = new MongoClientURI("mongodb://root:root@ds035004.mongolab.com:35004/aseproject");
			MongoClient client = new MongoClient(uri);

			DB db = client.getDB(uri.getDatabase());
			DBCollection users = db.getCollection("users");
			WriteResult result = users.insert(user1);

			response.setHeader("Access-Control-Allow-Origin", "*");
			response.setHeader("Access-Control-Allow-Methods", "POST");
			response.setHeader("Access-Control-Allow-Headers", "Content-Type");
			response.setHeader("Access-Control-Max-Age", "86400");

			response.getWriter().write(result.toString());
		}
}
