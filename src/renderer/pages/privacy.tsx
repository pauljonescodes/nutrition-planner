import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const PrivacyPage = () => {
  return (
    <Box p={4}>
      <Heading size="lg">Privacy Policy</Heading>
      <Text mt={4}>
        This Privacy Policy outlines the types of information that are not
        collected, used, or shared when you use this application. Since the
        application is designed to operate without collecting any personal data
        from its users, our Privacy Policy is straightforward: We collect no
        data.
      </Text>
      <Heading size="md" mt={6}>
        No Data Collection
      </Heading>
      <Text mt={2}>
        We do not collect, store, or process any personal information, including
        but not limited to, names, email addresses, or usage data. The
        application does not require user registration, and we do not track user
        activities or store any information regarding the usage of the
        application.
      </Text>
      <Heading size="md" mt={6}>
        No Cookies
      </Heading>
      <Text mt={2}>
        The application does not use cookies or any similar tracking
        technologies that collect personal information.
      </Text>
      <Heading size="md" mt={6}>
        No Third-Party Sharing
      </Heading>
      <Text mt={2}>
        Since no personal data is collected, there is no information to share
        with third parties.
      </Text>
      <Heading size="md" mt={6}>
        Disclaimer of Warranties
      </Heading>
      <Text mt={2}>
        The application is provided "as is" and "as available," without any
        warranties of any kind, either express or implied, including but not
        limited to the implied warranties of merchantability, fitness for a
        particular purpose, or non-infringement. We do not warrant that the
        application will always be available, accessible, uninterrupted, timely,
        secure, accurate, complete, or error-free.
      </Text>
      <Heading size="md" mt={6}>
        Changes to Our Privacy Policy
      </Heading>
      <Text mt={2}>
        We reserve the right to update or change our Privacy Policy at any time
        and you should check this Privacy Policy periodically. Your continued
        use of the service after we post any modifications to the Privacy Policy
        on this page will constitute your acknowledgment of the modifications
        and your consent to abide and be bound by the modified Privacy Policy.
      </Text>
      <Heading size="md" mt={6}>
        Contact Us
      </Heading>
      <Text mt={2}>
        If you have any questions about this Privacy Policy, please contact paul.jones@adeptry.com
      </Text>
    </Box>
  );
};

export default PrivacyPage;
