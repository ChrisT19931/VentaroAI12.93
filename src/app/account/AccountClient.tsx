'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProtectedDownload from '@/components/ProtectedDownload';
import { formatDate } from '@/lib/date';

interface AccountClientProps {
  initialOrders: any[];
  initialIsAdmin: boolean;
  user: any;
}

export default function AccountClient({ initialOrders, initialIsAdmin, user }: AccountClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [activeTab, setActiveTab] = useState('purchases'); // Default to purchases tab
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
      toast.success('You have been signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <Button
              onClick={handleSignOut}
              variant="danger"
              size="md"
            >
              Sign Out
            </Button>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
            <p className="text-gray-300"><span className="text-gray-400">Email:</span> {user?.email || 'Loading...'}</p>
            <p className="text-gray-300 mt-2"><span className="text-gray-400">Member since:</span> {user && 'created_at' in user && user.created_at ? formatDate(user.created_at as string) : 'N/A'}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'purchases' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('purchases')}
          >
            My Purchases
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'agents' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('agents')}
          >
            VAI Agents
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'downloads' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('downloads')}
          >
            Downloads
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          {isAdmin && (
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'admin' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Tools
            </button>
          )}
        </div>

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Purchases</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-white mb-2">No purchases yet</h3>
                <p className="text-gray-400 mb-6">You haven't made any purchases yet.</p>
                <Button
                  href="/products"
                  variant="primary"
                  size="lg"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div>
                <div className="bg-emerald-900/30 rounded-lg p-4 mb-6 border border-emerald-800/50">
                  <div className="flex items-start gap-3">
                    <div className="text-emerald-400 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-emerald-300 font-medium">Purchase History</h4>
                      <p className="text-emerald-200/80 text-sm mt-1">Your purchase history is displayed below. Click on any product to view details.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Order #{order.id.substring(0, 8)}</h3>
                          <p className="text-xs text-gray-400">Purchased on {formatDate(order.created_at)}</p>
                        </div>
                        <div className="bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-800/50">
                          <p className="text-xs text-emerald-400 font-medium">{order.status}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {order.order_items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors">
                            <div className="flex items-center space-x-4">
                              {item.product?.image_url && (
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                                  <img 
                                    src={item.product.image_url} 
                                    alt={item.product?.name || 'Product'} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-white text-lg">{item.product?.name || 'Product'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded-full border border-blue-800/50">
                                    {item.product?.type || 'Digital'}
                                  </span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-sm text-gray-300 font-medium">${(item.price / 100).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              {item.download_url ? (
                                <Button 
                                  href={`/downloads/${item.product_id}?session_id=${order.id}&token=${Buffer.from(`${order.id}-${order.id}-${item.product_id}`).toString('base64')}`}
                                  variant="success"
                                  size="sm"
                                >
                                  Download
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled
                                  className="bg-gray-700 text-gray-300"
                                >
                                  No Download
                                </Button>
                              )}
                              
                              <Link 
                                href={`/products/${item.product_id}`}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                View Product
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                        <p className="text-gray-400">Total</p>
                        <p className="font-semibold text-white">${(order.total / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VAI Agents Tab */}
        {activeTab === 'agents' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">VAI Agents Dashboard</h2>
              <p className="text-gray-400 text-lg">Access your AI-powered business assistants</p>
            </div>
            
            {/* Check if user has agent access */}
            {orders.some(order => order.order_items.some((item: any) => item.product?.name?.toLowerCase().includes('agent'))) ? (
              <div>
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 mb-8 border border-purple-500/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Welcome to VAI Agents</h3>
                      <p className="text-purple-300">Your AI assistants are ready to help transform your business</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Strategy Agent */}
                  <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Strategy Agent</h3>
                      <p className="text-gray-300 text-sm mb-4">Advanced business strategy and market analysis</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Market Analysis
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Strategic Planning
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Competitive Intelligence
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    >
                      Launch Agent
                    </Button>
                  </div>

                  {/* Growth Agent */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📈</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Growth Agent</h3>
                      <p className="text-gray-300 text-sm mb-4">Scaling operations and revenue optimization</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Revenue Optimization
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Process Automation
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Scaling Strategies
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      Launch Agent
                    </Button>
                  </div>

                  {/* Marketing Agent */}
                  <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Marketing Agent</h3>
                      <p className="text-gray-300 text-sm mb-4">Campaign creation and ROI optimization</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                        Campaign Creation
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                        Customer Analytics
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                        ROI Optimization
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
                    >
                      Launch Agent
                    </Button>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Usage Statistics</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">127</div>
                      <div className="text-sm text-gray-400">Total Queries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">23h</div>
                      <div className="text-sm text-gray-400">Time Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">94%</div>
                      <div className="text-sm text-gray-400">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-4">No VAI Agents Access</h3>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Unlock the power of AI-driven business automation with our specialized agents. 
                  Choose from our Strategy, Growth, and Marketing agents to transform your business operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    href="/vai-agents"
                    variant="primary"
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    View VAI Agents Plans
                  </Button>
                  <Button
                    href="/contact"
                    variant="secondary"
                    size="lg"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Downloads</h2>
            
            {orders.length === 0 || !orders.some(order => order.order_items.some((item: any) => item.download_url)) ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-white mb-2">No downloads available</h3>
                <p className="text-gray-400 mb-6">You don't have any downloadable products yet.</p>
                <Button
                  href="/products"
                  variant="success"
                  size="lg"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div>
                <div className="bg-blue-900/30 rounded-lg p-4 mb-6 border border-blue-800/50">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-400 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-blue-300 font-medium">Download Information</h4>
                      <p className="text-blue-200/80 text-sm mt-1">Your purchased downloads are available here. You can download them anytime from your account.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {orders
                    .filter(order => order.order_items.some((item: any) => item.download_url))
                    .map((order) => (
                      <div key={order.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Order #{order.id.substring(0, 8)}</h3>
                            <p className="text-xs text-gray-400">Purchased on {formatDate(order.created_at)}</p>
                          </div>
                          <div className="bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-800/50">
                            <p className="text-xs text-emerald-400 font-medium">{order.status}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {order.order_items
                            .filter((item: any) => item.download_url)
                            .map((item: any) => (
                              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors">
                                <div className="flex items-center space-x-4">
                                  {item.product?.image_url && (
                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                                      <img 
                                        src={item.product.image_url} 
                                        alt={item.product?.name || 'Product'} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-white text-lg">{item.product?.name || 'Product'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded-full border border-blue-800/50">
                                        {item.product?.type || 'Digital'}
                                      </span>
                                      <span className="text-xs text-gray-400">•</span>
                                      <span className="text-xs text-gray-400">Downloads: {item.download_count || 0}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                  <Button 
                                    href={`/downloads/${item.product_id}?session_id=${order.id}&token=${Buffer.from(`${order.id}-${order.id}-${item.product_id}`).toString('base64')}`}
                                    variant="success"
                                    size="sm"
                                  >
                                    Download
                                  </Button>
                                  
                                  <Link 
                                    href={`/products/${item.product_id}`}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                  >
                                    View Product
                                  </Link>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                  <div className="bg-blue-900/30 px-3 py-1 rounded-full border border-blue-800/50">
                    <p className="text-xs text-blue-400 font-medium">Active</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-900/70 rounded-md p-3 border border-gray-700 w-full">
                        <p className="text-white">{user?.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('This feature is coming soon!')}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-900/70 rounded-md p-3 border border-gray-700 w-full">
                        <p className="text-white">••••••••••••</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Password reset feature coming soon!')}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div>
                      <p className="font-medium text-white">Order Updates</p>
                      <p className="text-sm text-gray-400">Receive notifications about your orders</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="order-updates" 
                        className="absolute w-6 h-6 opacity-0 cursor-pointer" 
                        defaultChecked={true}
                        onChange={() => toast.success('Preference saved!')}
                      />
                      <label 
                        htmlFor="order-updates" 
                        className="block h-6 overflow-hidden rounded-full cursor-pointer bg-gray-700"
                      >
                        <span className="block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-blue-500 translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div>
                      <p className="font-medium text-white">Product Updates</p>
                      <p className="text-sm text-gray-400">Receive notifications about product updates</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="product-updates" 
                        className="absolute w-6 h-6 opacity-0 cursor-pointer" 
                        defaultChecked={true}
                        onChange={() => toast.success('Preference saved!')}
                      />
                      <label 
                        htmlFor="product-updates" 
                        className="block h-6 overflow-hidden rounded-full cursor-pointer bg-gray-700"
                      >
                        <span className="block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-blue-500 translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-900/20 rounded-lg p-6 border border-red-800/30">
                <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                <p className="text-gray-400 mb-4">These actions are irreversible. Please proceed with caution.</p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => toast.error('This feature is not available yet.')}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Admin Tools Tab */}
        {activeTab === 'admin' && isAdmin && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Tools</h2>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Product Management</h3>
              <p className="text-gray-400 mb-4">Manage your store's products.</p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="success"
                  size="md"
                  href="/admin/products"
                >
                  Manage Products
                </Button>
                
                <Button
                  variant="primary"
                  size="md"
                  href="/admin/products/new"
                >
                  Add New Product
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Management</h3>
              <p className="text-gray-400 mb-4">View and manage customer orders.</p>
              
              <Button
                variant="primary"
                size="md"
                href="/admin/orders"
              >
                View All Orders
              </Button>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
              <p className="text-gray-400 mb-4">Manage user accounts and permissions.</p>
              
              <Button
                variant="primary"
                size="md"
                href="/admin/users"
              >
                Manage Users
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}