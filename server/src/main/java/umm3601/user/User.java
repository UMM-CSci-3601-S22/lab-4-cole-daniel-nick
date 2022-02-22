package umm3601.user;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class User {

  @ObjectId @Id
  public String _id;

  public String name;
  public int age;
  public String company;
  public String email;
  public String avatar;
  public String role;
}
