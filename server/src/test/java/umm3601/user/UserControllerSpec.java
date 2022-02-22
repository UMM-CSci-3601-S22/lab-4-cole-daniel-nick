package umm3601.user;

import static com.mongodb.client.model.Filters.eq;
import static io.javalin.plugin.json.JsonMapperKt.JSON_MAPPER_KEY;
import static java.util.Map.entry;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatcher;

import io.javalin.core.JavalinConfig;
import io.javalin.core.validation.ValidationException;
import io.javalin.core.validation.Validator;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJackson;

/**
* Tests the logic of the UserController
*
* @throws IOException
*/
public class UserControllerSpec {
  private static final long maxRequestSize = new JavalinConfig().maxRequestSize;
  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private UserController userController;

  private ObjectId samsId;

  static MongoClient mongoClient;
  static MongoDatabase db;

  private static JavalinJackson javalinJackson = new JavalinJackson();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }

  @BeforeEach
  public void setupEach() throws IOException {
    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> userDocuments = db.getCollection("users");
    userDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    testUsers.add(
      new Document()
        .append("name", "Chris")
        .append("age", 25)
        .append("company", "UMM")
        .append("email", "chris@this.that")
        .append("role", "admin")
        .append("avatar", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon"));
    testUsers.add(
      new Document()
        .append("name", "Pat")
        .append("age", 37)
        .append("company", "IBM")
        .append("email", "pat@something.com")
        .append("role", "editor")
        .append("avatar", "https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon"));
    testUsers.add(
      new Document()
        .append("name", "Jamie")
        .append("age", 37)
        .append("company", "OHMNET")
        .append("email", "jamie@frogs.com")
        .append("role", "viewer")
        .append("avatar", "https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon"));

    samsId = new ObjectId();
    Document sam =
      new Document()
        .append("_id", samsId)
        .append("name", "Sam")
        .append("age", 45)
        .append("company", "OHMNET")
        .append("email", "sam@frogs.com")
        .append("role", "viewer")
        .append("avatar", "https://gravatar.com/avatar/08b7610b558a4cbbd20ae99072801f4d?d=identicon");


    userDocuments.insertMany(testUsers);
    userDocuments.insertOne(sam);

    userController = new UserController(db);
  }

  /**
   * Construct an instance of `ContextUtil`, which is essentially
   * a mock context in Javalin. See `mockContext(String, Map)` for
   * more details.
   */
  private Context mockContext(String path) {
    return mockContext(path, Map.of());
  }

  /**
   * Construct an instance of `ContextUtil`, which is essentially a mock
   * context in Javalin. We need to provide a couple of attributes, which is
   * the fifth argument, which forces us to also provide the (default) value
   * for the fourth argument. There are two attributes we need to provide:
   *
   *   - One is a `JsonMapper` that is used to translate between POJOs and JSON
   *     objects. This is needed by almost every test.
   *   - The other is `maxRequestSize`, which is needed for all the ADD requests,
   *     since `ContextUtil` checks to make sure that the request isn't "too big".
   *     Those tests fails if you don't provide a value for `maxRequestSize` for
   *     it to use in those comparisons.
   */
  private Context mockContext(String path, Map<String, String> pathParams) {
    return ContextUtil.init(
        mockReq, mockRes,
        path,
        pathParams,
        HandlerType.INVALID,
        Map.ofEntries(
          entry(JSON_MAPPER_KEY, javalinJackson),
          entry(ContextUtil.maxRequestSizeKey, maxRequestSize)));
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllUsers() throws IOException {
    // Create our fake Javalin context
    String path = "api/users";
    Context ctx = mockContext(path);
    userController.getUsers(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("users").countDocuments(),
       javalinJackson.fromJsonString(result, User[].class).length);
  }

  @Test
  public void GetUsersByAge() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("age=37");

    // Create our fake Javalin context
    Context ctx = mockContext("api/users");

    userController.getUsers(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();
    User[] resultUsers = javalinJackson.fromJsonString(result, User[].class);

    assertEquals(2, resultUsers.length); // There should be two users returned
    for (User user : resultUsers) {
      assertEquals(37, user.age); // Every user should be age 37
    }
  }

  @Test
  public void getUsersByAge() throws JsonMappingException, JsonProcessingException {
    Context ctx = mock(Context.class);
    // When the controller calls `ctx.queryParamMap`, return the expected map for an
    // "?age=37" query.
    when(ctx.queryParamMap()).thenReturn(Map.of(UserController.AGE_KEY, List.of("37")));
    // When the controller calls `ctx.queryParamAsClass() to get the value associated with
    // the "age" key, return an appropriate Validator. TBH, I never did figure out what the
    // third argument to the Validator constructor was for, but `null` seems OK. I'm also not sure
    // what the first argument is; it appears that you can set it to anything that isn't
    // null and it's happy.
    Validator<Integer> validator = new Validator<Integer>("age", 37, null);
    when(ctx.queryParamAsClass(UserController.AGE_KEY, Integer.class)).thenReturn(validator);

    // Call the method under test.
    userController.getUsers(ctx);

    // Verify that `getUsers` called `ctx.status(200)` at some point.
    verify(ctx).status(200);

    // Verify that `ctx.json()` is called with a `List` of `User`s.
    // Each of those `User`s should have age 37.
    verify(ctx).json(argThat(new ArgumentMatcher<List<User>>() {
      public boolean matches(List<User> users) {
        for (User user : users) {
          assertEquals(37, user.age);
        }
        return true;
      }
    }));
  }

  /**
  * Test that if the user sends a request with an illegal value in
  * the age field (i.e., something that can't be parsed to a number)
  * we get a reasonable error code back.
  */
  @Test
  public void GetUsersWithIllegalAge() {

    mockReq.setQueryString("age=abc");
    Context ctx = mockContext("api/users");

    // This should now throw a `ValidationException` because
    // our request has an age that can't be parsed to a number.
    assertThrows(ValidationException.class, () -> {
      userController.getUsers(ctx);
    });
  }

  @Test
  public void GetUsersByCompany() throws IOException {

    mockReq.setQueryString("company=OHMNET");
    Context ctx = mockContext("api/users");
    userController.getUsers(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();

    User[] resultUsers = javalinJackson.fromJsonString(result, User[].class);

    assertEquals(2, resultUsers.length); // There should be two users returned
    for (User user : resultUsers) {
      assertEquals("OHMNET", user.company);
    }
  }

  @Test
  public void GetUsersByRole() throws IOException {

    mockReq.setQueryString("role=viewer");
    Context ctx = mockContext("api/users");
    userController.getUsers(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    for (User user : javalinJackson.fromJsonString(result, User[].class)) {
      assertEquals("viewer", user.role);
    }
  }

  @Test
  public void GetUsersByCompanyAndAge() throws IOException {

    mockReq.setQueryString("company=OHMNET&age=37");
    Context ctx = mockContext("api/users");
    userController.getUsers(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    User[] resultUsers = javalinJackson.fromJsonString(result, User[].class);

    assertEquals(1, resultUsers.length); // There should be one user returned
    for (User user : resultUsers) {
      assertEquals("OHMNET", user.company);
      assertEquals(37, user.age);
    }
  }

  @Test
  public void GetUserWithExistentId() throws IOException {

    String testID = samsId.toHexString();

    Context ctx = mockContext("api/users", Map.of("id", testID));
    userController.getUser(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    User resultUser = javalinJackson.fromJsonString(result, User.class);

    assertEquals(samsId.toHexString(), resultUser._id);
    assertEquals("Sam", resultUser.name);
  }

  @Test
  public void GetUserWithBadId() throws IOException {
    Context ctx = mockContext("api/users", Map.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      userController.getUser(ctx);
    });
  }

  @Test
  public void GetUserWithNonexistentId() throws IOException {
    Context ctx = mockContext("api/users/", Map.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.getUser(ctx);
    });
  }

  @Test
  public void AddUser() throws IOException {

    String testNewUser = "{"
      + "\"name\": \"Test User\","
      + "\"age\": 25,"
      + "\"company\": \"testers\","
      + "\"email\": \"test@example.com\","
      + "\"role\": \"viewer\""
      + "}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/users");

    userController.addNewUser(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = javalinJackson.fromJsonString(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("users").countDocuments(eq("_id", new ObjectId(id))));

    //verify user was added to the database and the correct ID
    Document addedUser = db.getCollection("users").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedUser);
    assertEquals("Test User", addedUser.getString("name"));
    assertEquals(25, addedUser.getInteger("age"));
    assertEquals("testers", addedUser.getString("company"));
    assertEquals("test@example.com", addedUser.getString("email"));
    assertEquals("viewer", addedUser.getString("role"));
    assertTrue(addedUser.containsKey("avatar"));
  }

  @Test
  public void AddInvalidEmailUser() throws IOException {
    String testNewUser = "{"
      + "\"name\": \"Test User\","
      + "\"age\": 25,"
      + "\"company\": \"testers\","
      + "\"email\": \"invalidemail\","
      + "\"role\": \"viewer\""
      + "}";
    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");
    Context ctx = mockContext("api/users");

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  public void AddInvalidAgeUser() throws IOException {
    String testNewUser = "{"
      + "\"name\": \"Test User\","
      + "\"age\": \"notanumber\","
      + "\"company\": \"testers\","
      + "\"email\": \"test@example.com\","
      + "\"role\": \"viewer\""
      + "}";
    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");
    Context ctx = mockContext("api/users");

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  public void AddInvalidNameUser() throws IOException {
    String testNewUser = "{"
      + "\"age\": 25,"
      + "\"company\": \"testers\","
      + "\"email\": \"test@example.com\","
      + "\"role\": \"viewer\""
      + "}";
    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");
    Context ctx = mockContext("api/users");

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  public void AddInvalidRoleUser() throws IOException {
    String testNewUser = "{"
      + "\"name\": \"Test User\","
      + "\"age\": 25,"
      + "\"company\": \"testers\","
      + "\"email\": \"test@example.com\","
      + "\"role\": \"invalidrole\""
      + "}";
    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");
    Context ctx = mockContext("api/users");

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  public void DeleteUser() throws IOException {

    String testID = samsId.toHexString();

    // User exists before deletion
    assertEquals(1, db.getCollection("users").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = mockContext("api/users", Map.of("id", testID));
    userController.deleteUser(ctx);

    assertEquals(200, mockRes.getStatus());

    // User is no longer in the database
    assertEquals(0, db.getCollection("users").countDocuments(eq("_id", new ObjectId(testID))));
  }

}
