// Re-export of Apollo's gql for DYNAMICALLY BUILT queries (template interpolation).
// Kept as a separate module so graphql-codegen's static extraction
// (which tracks gql imports from known GraphQL packages) ignores these.
// Statically written queries should use the typed `graphql` tag from src/gql instead.
export { gql } from '@apollo/client'
