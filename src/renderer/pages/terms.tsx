/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

function TermsPage() {
  return (
    <Box p={4}>
      <Heading size="lg">Terms of Service</Heading>
      <Text mt={4}>
        By accessing or using this application, you agree to be bound by these
        Terms of Service ("Terms"). If you disagree with any part of the terms,
        you may not access the application.
      </Text>
      <Heading size="md" mt={6}>
        No Data Collection
      </Heading>
      <Text mt={2}>
        This application does not collect, store, transmit, or share any
        personal data, information, or user-generated content. It is designed to
        function without the need for such data, ensuring your use of the
        application remains private and secure.
      </Text>
      <Heading size="md" mt={6}>
        Disclaimer of Warranties
      </Heading>
      <Text mt={2}>
        The application is provided "as is" and "as available," without any
        warranties of any kind, either express or implied, including but not
        limited to the implied warranties of merchantability, fitness for a
        particular purpose, or non-infringement. The owners and contributors do
        not warrant that the application will function uninterrupted, that it is
        error-free or that any errors will be corrected.
      </Text>
      <Heading size="md" mt={6}>
        Limitation of Liability
      </Heading>
      <Text mt={2}>
        In no event shall the owners or contributors be liable for any indirect,
        incidental, special, consequential, or punitive damages, or any loss of
        profits or revenues, whether incurred directly or indirectly, or any
        loss of data, use, goodwill, or other intangible losses, resulting from
        (a) your access to or use of or inability to access or use the
        application; (b) any conduct or content of any third party on the
        application; or (c) unauthorized access, use, or alteration of your
        transmissions or content.
      </Text>
      <Heading size="md" mt={6}>
        Changes to Terms
      </Heading>
      <Text mt={2}>
        We reserve the right, at our sole discretion, to modify or replace these
        Terms at any time. If a revision is material, we will try to provide at
        least 30 days' notice prior to any new terms taking effect. What
        constitutes a material change will be determined at our sole discretion.
      </Text>
      <Heading size="md" mt={6}>
        Contact Us
      </Heading>
      <Text mt={2}>
        If you have any questions about these Terms, please contact me:
        paul.jones@adeptry.com
      </Text>
    </Box>
  );
}

export default TermsPage;
