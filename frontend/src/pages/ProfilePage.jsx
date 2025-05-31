import { useState, useEffect } from 'react';
import { MapPin, Edit3, Save, X, User, Mail, Phone, Star, Package, Heart, Award } from 'lucide-react';

const ProfilePage = () => {
  const [userAddress, setUserAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [addressInput, setAddressInput] = useState('');

  // Simulate checking if user has address on component mount
  useEffect(() => {
    // In real implementation, check if user has saved address
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      setUserAddress(savedAddress);
      setIsFirstTimeUser(false);
    }
  }, []);

  const handleAddressSubmit = () => {
    if (addressInput.trim()) {
      setUserAddress(addressInput);
      setIsFirstTimeUser(false);
      setIsEditingAddress(false);
      // In real implementation, save to backend/database
      localStorage.setItem('userAddress', addressInput);
    }
  };

  const handleEditAddress = () => {
    setAddressInput(userAddress);
    setIsEditingAddress(true);
  };

  const handleCancelEdit = () => {
    setAddressInput('');
    setIsEditingAddress(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - User Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Bonten Mikey</h2>
                <span className="bg-green-500 text-xs px-2 py-1 rounded-full">Premium User</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Bio & other details</h3>
              
              <div>
                <label className="text-gray-400 text-sm">Name</label>
                <p className="text-white">Mikey</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-white">mikey@gmail.com</p>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Phone Number</label>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-white">+91 0123456789</p>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Address</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {isFirstTimeUser || isEditingAddress ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        placeholder="Enter your address"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={handleAddressSubmit}
                        className="bg-green-500 hover:bg-green-600 p-2 rounded transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      {!isFirstTimeUser && (
                        <button
                          onClick={handleCancelEdit}
                          className="bg-red-500 hover:bg-red-600 p-2 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-white">{userAddress}</p>
                      <button
                        onClick={handleEditAddress}
                        className="bg-blue-500 hover:bg-blue-600 p-1 rounded transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Profile Info */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-pink-500 border-opacity-50">
            <div className="space-y-6">

              {/* E-commerce Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded p-3">
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-xs">Total Orders</p>
                        <p className="text-white font-bold text-lg">24</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-gray-400 text-xs">Wishlist Items</p>
                        <p className="text-white font-bold text-lg">12</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-gray-400 text-xs">Reviews Written</p>
                        <p className="text-white font-bold text-lg">8</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-xs">Reward Points</p>
                        <p className="text-white font-bold text-lg">1,250</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-white">January 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Login:</span>
                    <span className="text-white">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Spent:</span>
                    <span className="text-white">$1,249.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verification Status:</span>
                    <span className="text-green-400">Verified ✓</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;