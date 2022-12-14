import { gql } from "@apollo/client";

export const GET_MEMBERS = gql`
  query {
    members {
      data {
        id
        firstName
        lastName
        phoneNumber
        photo
        note
        status
        remainingDays
        currentMembershipType
        createdAt
      }
      errors {
        message
        pointer
        type
      }
    }
  }
`;
