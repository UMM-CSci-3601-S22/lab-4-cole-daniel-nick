package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

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
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

  private static final String OWNER_KEY = "owner";
  private static final String CATEGORY_KEY = "category";
  private static final String BODY_KEY = "contains";
  private static final String STATUS_KEY = "status";

  private final JacksonMongoCollection<Todo> todoCollection;

  /**
   * Construct a controller for todos.
   *
   * @param database the database containing todo data
   */
  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(database, "todos", Todo.class);
  }

  /**
   * Get the single todo specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getTodo(Context ctx) {
    String id = ctx.pathParam("id");
    Todo todo;

    try {
      todo = todoCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested todo id wasn't a legal Mongo Object ID.");
    }
    if (todo == null) {
      throw new NotFoundResponse("The requested todo was not found");
    } else {
      ctx.json(todo);
    }
  }

  /**
   * Delete the todo specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteTodo(Context ctx) {
    String id = ctx.pathParam("id");
    todoCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the todos.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getTodos(Context ctx) {

    List<Bson> filters = new ArrayList<>(); // start with a blank document

    if (ctx.queryParamMap().containsKey(OWNER_KEY)) {
      filters.add(regex(OWNER_KEY, Pattern.quote(ctx.queryParam(OWNER_KEY)), "i"));
    }

    if (ctx.queryParamMap().containsKey(BODY_KEY)) {
      if (ctx.queryParam(BODY_KEY).length() <= 0) {
        throw new BadRequestResponse("Illegal status sent");
      }
      filters.add(regex("body", Pattern.quote(ctx.queryParam(BODY_KEY)), "i"));
    }

    if (ctx.queryParamMap().containsKey(CATEGORY_KEY)) {
      filters.add(regex(CATEGORY_KEY, Pattern.quote(ctx.queryParam(CATEGORY_KEY)), "i"));
    }

    if (ctx.queryParamMap().containsKey(STATUS_KEY)) {
      if (!ctx.queryParam(STATUS_KEY).equals("true") && !ctx.queryParam(STATUS_KEY).equals("false")) {
        throw new BadRequestResponse("Illegal status sent");
      }
      Boolean targetStatus = ctx.queryParamAsClass(STATUS_KEY, Boolean.class).get();
      filters.add(eq(STATUS_KEY, targetStatus));
    }
    // Sort the results. Use the `sortby` query param (default "name")
    // as the field to sort by, and the query param `sortorder` (default
    // "asc") to specify the sort order.
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), OWNER_KEY);
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");

    ctx.json(todoCollection.find(filters.isEmpty() ? new Document() : and(filters))
        .sort(sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy))
        .into(new ArrayList<>()));
  }

  /**
   * Get a JSON response with a list of all the todos.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewTodo(Context ctx) {
    Todo newTodo = ctx.bodyValidator(Todo.class)
        // Verify that the todo has a name that is not blank
        .check(todo -> todo.owner != null && todo.owner.length() > 0, "Todo must have a non-empty todo owner")
        // Verify that the provided body is not blank
        .check(todo -> todo.body != null && todo.body.length() > 0, "Todo must have a non-empty todo body")
        // Verify that the status is either true or false
        .check(todo -> Boolean.valueOf(todo.status), "Todo must have a legal todo status")
        // Verify that the todo has a category that is not blank
        .check(todo -> todo.category != null && todo.category.length() > 0, "Todo must have a non-empty category name")
        .get();

    todoCollection.insertOne(newTodo);
    ctx.status(HttpCode.OK);
    ctx.json(Map.of("id", newTodo._id));
  }
}
