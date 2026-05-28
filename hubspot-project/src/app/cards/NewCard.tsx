import React from 'react';
import { EmptyState, Button, Text, hubspot } from '@hubspot/ui-extensions';

// Define strict types for components to resolve the TSX Parameter Implicitly Any error
interface ExtensionProps {
  context: any;
  actions: any;
}

hubspot.extend<'crm.record.tab'>(({ context, actions }) => (
  <Extension context={context} actions={actions} />
));

const Extension = ({ context, actions }: ExtensionProps) => {
  const openCockpit = () => {
    // Pass the real HubSpot contact ID as a URL parameter so the
    // React dashboard can fetch live data for this exact contact
    const contactId = context?.crm?.objectId;
    const iframeUrl = contactId
      ? `https://thriving-maamoul-fa5dc1.netlify.app?contactId=${contactId}`
      : 'https://thriving-maamoul-fa5dc1.netlify.app';

    actions.openIframeModal({
      uri: iframeUrl,
      height: 800,
      width: 1200,
      title: 'Athletic Knit - Sales Call Prep Command Center',
    });
  };

  return (
    <EmptyState
      title="Athletic Knit CRM Cockpit"
      layout="vertical"
      imageName="building"
    >
      <Text>
        Execute sales calls, verify sublimated jersey orders, check artwork checklists, and track pipeline stages inside your advanced B2B operations center.
      </Text>
      <Button variant="primary" onClick={openCockpit}>
        🚀 Launch Sales Call Prep Workspace
      </Button>
    </EmptyState>
  );
};
