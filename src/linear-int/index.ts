/**
 * Coding exercise: Data loading, TypeScript modeling, relationship graph building
 *
 * We will attempt to build a simple system that loads API data of models in the DB and
 * builds an object graph from them.
 *
 * For this exercise, we will use a sample response from the Linear GraphQL API in bootstrap.json.
 * To keep things simple:
 * - Only the data.syncBootstrap.state property is relevant.
 * - We will focus on only the Organization and User models.
 * - Only the fields "id", "name", "email", and "organizationId" are important; all others can be disregarded.
 *
 * Suggested stages of exercise:
 *
 * 1. Import and parse data
 * 2. TypeScript modeling, class hierarchy and type annotation
 * 3. Build a way to search for objects by their ID
 *        someMainObjectYouDevise.findById(User, "5aeb6c91-a46c-405a-a48b-98309ae68af4") // => User
 * 4. Build a way for objects to be able to resolve relations, eg.:
 *        user.organization  // => Organization
 *        organization.users // => [User, User]
 * 5. Make sure you can reference organizations and users from either direction.
 *        user.organization.users[0]              // => User
 *        user.organization.users[0].organization // => Organization
 *
 * Focus on completing the exercise in stages if possible, so it's easier for us to assess progress.
 */

import data from "./bootstrap.json";

type User = {
  id: string;
  name: string;
  email: string;
  organizationId: string;
};

type Organization = {
  id: string;
  name: string;
};

type EntityKey = "User" | "Organization";
type EntityMap = {
  User: UserClass;
  Organization: OrganizationClass;
};
type Entity = Record<string, unknown>;
type State = Record<string, Array<Entity>>;

class UserClass {
  static entityName = "User";

  id: string;
  name: string;
  email: string;
  organizationId: string;
  searchService: Store;

  constructor(
    id: string,
    name: string,
    email: string,
    organizationId: string,
    searchService: Store,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.organizationId = organizationId;
    this.searchService = searchService;
  }

  static fromRow(row: Entity, search: Store): UserClass {
    const u = row as User;
    return new UserClass(u.id, u.name, u.email, u.organizationId, search);
  }

  get organization() {
    return this.searchService.findById(OrganizationClass, this.organizationId);
  }
}

interface EntityClass<T> {
  entityName: string;
  fromRow(row: Entity, search: Store): T;
}

class OrganizationClass {
  static entityName = "Organization";

  id: string;
  name: string;
  private searchService: Store;

  constructor(id: string, name: string, searchService: Store) {
    this.id = id;
    this.name = name;
    this.searchService = searchService;
  }

  static fromRow(row: Entity, search: Store): OrganizationClass {
    const o = row as Organization;
    return new OrganizationClass(o.id, o.name, search);
  }

  get users(): UserClass[] {
    return this.searchService.findUsersByOrganization(this.id);
  }
}

// map.get("User+userId")
// map.get("User", "some-id")

class Store {
  private state: State;
  private cache = new Map<string, any>(); // Map<string, User | Organization | Whatever>

  constructor(state: State) {
    this.state = state;
    // creating a cache => { "User": { "123" : { ... } }}
    // cache.set("id", new OrganizationClass(plainOrganization))
  }

  // Follow ups
  // TODO: performance? read/write/look up
  // TODO: scalable for many entities (generics, removing ifs, etc?)
  // Follow up Questions: why choose plain objects vs classes?

  findById<T>(entityClass: EntityClass<T>, id: string): T | undefined {
    // const row = this.state[entityClass.entityName].find((x) => x.id === id);
    // return row && entityClass.fromRow(row, this);
    const cachedResult = this.cache.get(`${entityClass.entityName}:${id}`);
    if (cachedResult) {
      console.log("cached:", id);
      return cachedResult;
    }
    const row = this.state[entityClass.entityName].find((x) => x.id === id);
    const result = row && entityClass.fromRow(row, this);
    this.cache.set(`${entityClass.entityName}:${id}`, result);
    console.log("not cached:", id);
    return result;
  }

  // performance bottleneck
  findUsersByOrganization(orgId: string): UserClass[] {
    return this.state["User"]
      .filter((u) => (u as User).organizationId === orgId)
      .map((u) => this.findById(UserClass, u.id as string) as UserClass);
  }
}

const state = JSON.parse(data.data.syncBootstrap.state);
const search = new Store(state);

console.log(state);

// TODO: generics
const user1 = search.findById(
  UserClass,
  "dec2e11a-ec1b-4845-8819-19f3596e4ea9",
);
const user2 = search.findById(
  UserClass,
  "dec2e11a-ec1b-4845-8819-19f3596e4ea9",
);

// console.log("Organization: ", user1?.organization);
// console.log("Users from organization: ", user1?.organization?.users);

console.log("users: ", user1, user2);
