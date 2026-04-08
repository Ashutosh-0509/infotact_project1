import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Building2, User, Shield, DollarSign, Bell, Moon, Sun, Save, Lock, CreditCard, Globe, Clock, Percent } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

type SettingsTab = 'general' | 'preferences' | 'security' | 'system';

interface BusinessSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  timezone: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderAlerts: boolean;
  lowStockAlerts: boolean;
  language: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

interface SystemSettings {
  taxRate: number;
  defaultPaymentMethod: string;
  receiptFooter: string;
  lowStockThreshold: number;
  autoBackup: boolean;
}

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isSaving, setIsSaving] = useState(false);

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: 'POS & Inventory System',
    email: 'business@pos.com',
    phone: '+91 98765 43210',
    address: '123 Business Street',
    city: 'Mumbai',
    country: 'India',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    language: 'en',
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    taxRate: 10,
    defaultPaymentMethod: 'cash',
    receiptFooter: 'Thank you for your business!',
    lowStockThreshold: 10,
    autoBackup: true,
  });

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Settings Saved',
      description: 'Business settings have been updated successfully.',
    });
    
    setIsSaving(false);
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: 'Preferences Saved',
      description: 'Your preferences have been updated successfully.',
    });
    
    setIsSaving(false);
  };

  const handleSaveSecurity = async () => {
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (security.newPassword && security.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSecurity({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: security.twoFactorEnabled,
    });
    
    toast({
      title: 'Security Updated',
      description: 'Your security settings have been updated successfully.',
    });
    
    setIsSaving(false);
  };

  const handleSaveSystem = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'System Settings Saved',
      description: 'System configuration has been updated successfully.',
    });
    
    setIsSaving(false);
  };

  return (
    <Layout>
      <div className="w-full h-full overflow-auto">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <SettingsIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your system configuration and preferences</p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                <TabsTrigger value="general" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden sm:inline">System</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Update your business details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={businessSettings.businessName}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={businessSettings.email}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={businessSettings.phone}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={businessSettings.address}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={businessSettings.city}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={businessSettings.country}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, country: e.target.value })}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={businessSettings.currency} onValueChange={(value) => setBusinessSettings({ ...businessSettings, currency: value })}>
                          <SelectTrigger id="currency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={businessSettings.timezone} onValueChange={(value) => setBusinessSettings({ ...businessSettings, timezone: value })}>
                          <SelectTrigger id="timezone">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                            <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveGeneral} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Preferences</CardTitle>
                    <CardDescription>Customize your experience and notification settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Theme</Label>
                          <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                        </div>
                        <Select value={preferences.theme} onValueChange={(value: 'light' | 'dark' | 'system') => setPreferences({ ...preferences, theme: value })}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center gap-2">
                                <Sun className="w-4 h-4" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4" />
                                Dark
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                System
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                        </div>
                        <Switch
                          checked={preferences.emailNotifications}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                        </div>
                        <Switch
                          checked={preferences.pushNotifications}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Order Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                        </div>
                        <Switch
                          checked={preferences.orderAlerts}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, orderAlerts: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Low Stock Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified when products are low in stock</p>
                        </div>
                        <Switch
                          checked={preferences.lowStockAlerts}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, lowStockAlerts: checked })}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                          <SelectTrigger id="language">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSavePreferences} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={security.currentPassword}
                          onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={security.newPassword}
                          onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={security.confirmPassword}
                          onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch
                          checked={security.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                        />
                      </div>

                      {security.twoFactorEnabled && (
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex items-start gap-3">
                            <Lock className="w-5 h-5 text-primary mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Two-Factor Authentication Enabled</p>
                              <p className="text-sm text-muted-foreground">
                                You will need to enter a verification code from your authenticator app when signing in.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveSecurity} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Update Security'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Configure tax rates, payment methods, and system defaults</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="taxRate" className="flex items-center gap-2">
                          <Percent className="w-4 h-4" />
                          Tax Rate (%)
                        </Label>
                        <Input
                          id="taxRate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={systemSettings.taxRate}
                          onChange={(e) => setSystemSettings({ ...systemSettings, taxRate: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="defaultPayment" className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Default Payment Method
                        </Label>
                        <Select value={systemSettings.defaultPaymentMethod} onValueChange={(value) => setSystemSettings({ ...systemSettings, defaultPaymentMethod: value })}>
                          <SelectTrigger id="defaultPayment">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="digital">Digital Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                        <Input
                          id="lowStockThreshold"
                          type="number"
                          min="0"
                          value={systemSettings.lowStockThreshold}
                          onChange={(e) => setSystemSettings({ ...systemSettings, lowStockThreshold: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiptFooter">Receipt Footer Text</Label>
                        <Input
                          id="receiptFooter"
                          value={systemSettings.receiptFooter}
                          onChange={(e) => setSystemSettings({ ...systemSettings, receiptFooter: e.target.value })}
                          placeholder="Thank you message"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Automatic Backup</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
                      </div>
                      <Switch
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoBackup: checked })}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveSystem} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
