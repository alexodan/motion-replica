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

class Model {
  id!: string;
  store: Store;
  constructor(store: Store) {
    this.store = store;
  }
}

class User extends Model {
  name!: string;
  email!: string;
  organizationId!: string;

  get organization(): Organization | undefined {
    return this.store.findById("Organization", this.organizationId);
  }
}

class Organization extends Model {
  name!: string;

  get users(): User[] {
    return this.store.findMany("User", (u) => u.organizationId === this.id);
  }
}

type EntityTypeMap = {
  User: User;
  Organization: Organization;
};
type EntityKey = keyof EntityTypeMap;
type EntityMap = { [K in EntityKey]: EntityTypeMap[K][] };

class Store {
  private cache = new Map<EntityKey, Map<string, Model>>();

  constructor(state: EntityMap) {
    this.state = state;
    // "hydrate" the cache with actual object instances from the plain objects
    // like new User(plainObject)
  }

  findById<K extends EntityKey>(
    entityName: K,
    id: string,
  ): EntityTypeMap[K] | undefined {
    console.log("ddd");
    const entity = this.state[entityName].find((x) => x.id === id);
    return entity;
  }

  findMany<K extends EntityKey>(
    entityName: K,
    predicate: (raw: any) => boolean,
  ): EntityTypeMap[K][] {
    return this.state[entityName].filter(predicate);
  }
}

const state = JSON.parse(data.data.syncBootstrap.state) as EntityMap;
const store = new Store(state);

console.log(state);

// TODO: generics
const user = store.findById("User", "dec2e11a-ec1b-4845-8819-19f3596e4ea9");

console.log("Organization: ", user?.organization);
console.log("Users from organization: ", user?.organization?.users);
