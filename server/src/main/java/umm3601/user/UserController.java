package umm3601.user;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about users.
 */
public class UserController {

  public static final String AGE_KEY = "age";
  public static final String COMPANY_KEY = "company";
  public static final String ROLE_KEY = "role";

  static String emailRegex = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$";

  private final JacksonMongoCollection<User> userCollection;

  /**
   * Construct a controller for users.
   *
   * @param database the database containing user data
   */
  public UserController(MongoDatabase database) {
    userCollection = JacksonMongoCollection.builder().build(database, "users", User.class);
  }

  /**
   * Get the single user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getUser(Context ctx) {
    String id = ctx.pathParam("id");
    User user;

    try {
      user = userCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested user id wasn't a legal Mongo Object ID.");
    }
    if (user == null) {
      throw new NotFoundResponse("The requested user was not found");
    } else {
      ctx.json(user);
    }
  }

  /**
   * Delete the user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteUser(Context ctx) {
    String id = ctx.pathParam("id");
    userCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the users.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getUsers(Context ctx) {

    List<Bson> filters = new ArrayList<>(); // start with a blank document

    if (ctx.queryParamMap().containsKey(AGE_KEY)) {
        int targetAge = ctx.queryParamAsClass(AGE_KEY, Integer.class).get();
        filters.add(eq(AGE_KEY, targetAge));
    }

    if (ctx.queryParamMap().containsKey(COMPANY_KEY)) {
      filters.add(regex(COMPANY_KEY,  Pattern.quote(ctx.queryParam(COMPANY_KEY)), "i"));
    }

    if (ctx.queryParamMap().containsKey(ROLE_KEY)) {
      filters.add(eq(ROLE_KEY, ctx.queryParam(ROLE_KEY)));
    }

    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "name"); //Sort by sort query param, default is name
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");

    ctx.status(200);
    ctx.json(userCollection.find(filters.isEmpty() ? new Document() : and(filters))
      .sort(sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy))
      .into(new ArrayList<>()));
  }

  /**
   * Get a JSON response with a list of all the users.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewUser(Context ctx) {
    User newUser = ctx.bodyValidator(User.class)
      .check(usr -> usr.name != null && usr.name.length() > 0, "User must have a non-empty user name") //Verify that the user has a name that is not blank
      .check(usr -> usr.email.matches(emailRegex), "User must have a legal email") // Verify that the provided email is a valid email
      .check(usr -> usr.age > 0, "User's age must be greater than zero") // Verify that the provided age is > 0
      .check(usr -> usr.role.matches("^(admin|editor|viewer)$"), "User must have a legal user role") // Verify that the role is one of the valid roles
      .check(usr -> usr.company != null && usr.company.length() > 0, "User must have a non-empty company name") // Verify that the user has a company that is not blank
      .get();

    // Generate user avatar (you won't need this part for todos)
    try {
      newUser.avatar = "https://gravatar.com/avatar/" + md5(newUser.email) + "?d=identicon";  // generate unique md5 code for identicon
    } catch (NoSuchAlgorithmException ignored) {
      newUser.avatar = "https://gravatar.com/avatar/?d=mp";                           // set to mystery person
    }

    userCollection.insertOne(newUser);
    ctx.status(201);
    ctx.json(Map.of("id", newUser._id));
  }

  /**
   * Utility function to generate the md5 hash for a given string
   *
   * @param str the string to generate a md5 for
   */
  @SuppressWarnings("lgtm[java/weak-cryptographic-algorithm]")
  public String md5(String str) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("MD5");
    byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

    StringBuilder result = new StringBuilder();
    for (byte b : hashInBytes) {
      result.append(String.format("%02x", b));
    }
    return result.toString();
  }
}
