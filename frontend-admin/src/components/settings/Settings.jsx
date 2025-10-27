import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Eye, 
  Settings as SettingsIcon, 
  Brain, 
  Shield, 
  Mail,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

// Mock data
const defaultSettings = {
  siteName: "AI Thought Hub",
  siteDescription: "A creative space for sharing and refining thoughts with AI assistance.",
  theme: "system",
  ai: {
    suggestionStrength: "Medium",
    temperature: 0.7,
    delay: 2,
    enableChatbot: true,
    enableAutoSuggest: true,
  },
  contentPolicy: "Be respectful, no spam or hate speech. Keep discussions constructive. Our AI tools are designed to enhance creativity while maintaining a positive environment for all users.",
  emailTemplates: [
    {
      id: 1,
      name: "User Welcome",
      subject: "Welcome to AI Thought Hub!",
      body: "Hello {{username}}, thank you for joining our AI-powered community! We're excited to see the thoughts you'll share and refine with our AI tools."
    },
    {
      id: 2,
      name: "Post Report",
      subject: "Your post was reported",
      body: "Hi {{username}}, one of your posts has been flagged for review by our community. Our team will investigate this matter promptly."
    },
    {
      id: 3,
      name: "Password Reset",
      subject: "Reset Your Password",
      body: "We received a request to reset your password. Click the link below to create a new password: {{resetLink}}"
    },
    {
      id: 4,
      name: "Weekly Digest",
      subject: "Your Weekly Thought Digest",
      body: "Here's what you missed this week in the AI Thought Hub community..."
    }
  ]
};

// Toast Component
const Toast = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-lg z-50 transform transition-transform duration-300">
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  );
};

// Modal Component
const PreviewModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title} Preview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose dark:prose-invert max-w-none">
            {content}
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Platform Configuration Section
const PlatformConfigSection = ({ settings, updateSettings, showToast }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    showToast('Platform settings saved successfully!');
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    showToast('Platform settings reset to defaults!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Platform Configuration
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={localSettings.siteName}
            onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter your site name"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This name will appear in the browser tab and throughout the platform
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Description
          </label>
          <textarea
            value={localSettings.siteDescription}
            onChange={(e) => setLocalSettings({ ...localSettings, siteDescription: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Describe your platform"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            A brief description that explains your platform's purpose
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Theme Selection
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'light', icon: Sun, label: 'Light' },
              { value: 'dark', icon: Moon, label: 'Dark' },
              { value: 'system', icon: Monitor, label: 'System' }
            ].map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.value}
                  onClick={() => setLocalSettings({ ...localSettings, theme: theme.value })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    localSettings.theme === theme.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-2 text-gray-600 dark:text-gray-400" />
                  <div className="font-medium text-gray-900 dark:text-white">{theme.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// AI Settings Section
const AISettingsSection = ({ settings, updateSettings, showToast }) => {
  const [aiSettings, setAiSettings] = useState(settings.ai);

  const handleSave = () => {
    updateSettings({ ...settings, ai: aiSettings });
    showToast('AI settings saved successfully!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Settings
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suggestion Strength: <span className="font-semibold text-purple-600">{aiSettings.suggestionStrength}</span>
          </label>
          <div className="flex space-x-4">
            {['Low', 'Medium', 'High'].map((strength) => (
              <button
                key={strength}
                onClick={() => setAiSettings({ ...aiSettings, suggestionStrength: strength })}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  aiSettings.suggestionStrength === strength
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {strength}
              </button>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Controls how strongly AI influences thought refinement suggestions
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Model Temperature: <span className="font-semibold text-purple-600">{aiSettings.temperature}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={aiSettings.temperature}
            onChange={(e) => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>More Focused</span>
            <span>More Creative</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Auto-Suggestion Delay: <span className="font-semibold text-purple-600">{aiSettings.delay} seconds</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={aiSettings.delay}
            onChange={(e) => setAiSettings({ ...aiSettings, delay: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Time delay before AI suggestions appear while typing
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Enable AI Chatbot</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow users to interact with AI assistant
              </p>
            </div>
            <button
              onClick={() => setAiSettings({ ...aiSettings, enableChatbot: !aiSettings.enableChatbot })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiSettings.enableChatbot ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiSettings.enableChatbot ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Enable Auto Suggestions</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show AI suggestions automatically while typing
              </p>
            </div>
            <button
              onClick={() => setAiSettings({ ...aiSettings, enableAutoSuggest: !aiSettings.enableAutoSuggest })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiSettings.enableAutoSuggest ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiSettings.enableAutoSuggest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save AI Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Content Policy Section
const ContentPolicySection = ({ settings, updateSettings, showToast }) => {
  const [policy, setPolicy] = useState(settings.contentPolicy);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    updateSettings({ ...settings, contentPolicy: policy });
    showToast('Content policy updated successfully!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Content Policies
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Community Guidelines
          </label>
          <textarea
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-vertical"
            placeholder="Enter your community guidelines and content policies..."
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            These guidelines will be visible to all users and enforced by moderators
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Update Policy</span>
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Policy</span>
          </button>
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Content Policy"
        content={policy}
      />
    </div>
  );
};

// Email Templates Section
const EmailTemplatesSection = ({ settings, updateSettings, showToast }) => {
  const [templates, setTemplates] = useState(settings.emailTemplates);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleSaveTemplate = (templateId) => {
    const updatedSettings = {
      ...settings,
      emailTemplates: templates
    };
    updateSettings(updatedSettings);
    showToast(`${templates.find(t => t.id === templateId)?.name} template saved!`);
  };

  const updateTemplate = (templateId, field, value) => {
    setTemplates(templates.map(template =>
      template.id === templateId ? { ...template, [field]: value } : template
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Mail className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Email Templates
        </h2>
      </div>

      <div className="space-y-6">
        {templates.map((template) => (
          <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {template.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={template.subject}
                  onChange={(e) => updateTemplate(template.id, 'subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Body
                </label>
                <textarea
                  value={template.body}
                  onChange={(e) => updateTemplate(template.id, 'body', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-vertical"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Use variables like {'{{username}}'} for dynamic content
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleSaveTemplate(template.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Template</span>
                </button>
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Email</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PreviewModal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate?.name}
        content={
          <div className="space-y-4">
            <div>
              <strong>Subject:</strong> {previewTemplate?.subject}
            </div>
            <div>
              <strong>Body:</strong>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg whitespace-pre-wrap">
                {previewTemplate?.body}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

// Main Settings Component
const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('platform');
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const tabs = [
    { id: 'platform', label: 'Platform', icon: SettingsIcon },
    { id: 'ai', label: 'AI Settings', icon: Brain },
    { id: 'content', label: 'Content Policy', icon: Shield },
    { id: 'email', label: 'Email Templates', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your platform configuration, AI settings, and content policies
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {activeTab === 'platform' && (
          <PlatformConfigSection
            settings={settings}
            updateSettings={updateSettings}
            showToast={showToast}
          />
        )}
        
        {activeTab === 'ai' && (
          <AISettingsSection
            settings={settings}
            updateSettings={updateSettings}
            showToast={showToast}
          />
        )}
        
        {activeTab === 'content' && (
          <ContentPolicySection
            settings={settings}
            updateSettings={updateSettings}
            showToast={showToast}
          />
        )}
        
        {activeTab === 'email' && (
          <EmailTemplatesSection
            settings={settings}
            updateSettings={updateSettings}
            showToast={showToast}
          />
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Settings;