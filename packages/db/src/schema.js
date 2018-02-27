// @flow

import gql from 'graphql-tag';

// Plain GraphQL schema.
//
// Not in use, just for info.
export const Schema = gql`
  # Can be UUID instance or serialized to plain string.
  scalar UUID

  # RON Atom.
  # Note that null value is also possible, but cannot be
  # defined explictly in GraphQL language.
  union Atom = String | Int | Float | Bool | UUID

  # Generic interface to describe a node in the swarm.
  # Due to strict nature of types in the GraphQL language
  # it's not possible to define compound field names, so we have to
  # make an agreement that this interface describes all possible
  # shapes w/o explicit definition. But we still know that
  # at least two field are available.
  interface Node {
    id: UUID!
    __typename: String
  }

  directive @include(if: Bool!) on FIELD

  directive @skip(if: Bool!) on FIELD

  # To be able to define which node must be unwrapped
  # Can be missed if the field contains a UUID itself.
  # Overrides if explicitly passed.
  directive @node(id: UUID!) on FIELD

  # Casts Set's payload to an array and slice it with given arguments
  # A field should either already contains UUID or @node directive
  # must be passed first.
  directive @slice(offset: Int!, limit: Int) on FIELD

  # Returns a length of Set
  # A field should either already contains UUID or @node directive
  # must be passed first.
  directive @length on FIELD

  # Note. Priority of execution of directives from the first to the last.

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  # Non-empty POJO with string keys and Atoms as values. Used for lww type.
  # To delete field just pass undefined as a value.
  type Payload {
    _: Atom
  }

  # Operations which can be applied to certain nodes.
  # Different operations for different types, depending
  # on their CRDTs.
  #
  # Note that an error will be raised in case of type mismatch.
  type Mutation {
    # __typename: lww
    set(id: UUID!, payload: Payload!): Bool
    # __typename: set
    add(id: UUID!, value: Atom): Bool
    # __typename: set
    remove(id: UUID!, value: Atom): Bool
  }

  # Well, it's an empty object, '_' field used just
  # to follow GraphQL syntax. It's possible to describe any
  # shape right from the root of subscription, using directives
  # above.
  type Subscription {
    _: Node
  }

  type Query {
    _: Node
  }
`;
