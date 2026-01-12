import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🌐',
      title: 'UAE-Based Servers (Low Latency)',
      description: 'Dubai / Abu Dhabi data centers se ultra-fast speed, UAE users ke liye best performance.',
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
    },
    {
      icon: '⚡',
      title: 'High-Speed NVMe SSD Storage',
      description: 'NVMe SSD ke sath lightning-fast loading, websites aur apps ke liye smooth experience.',
      gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)'
    },
    {
      icon: '🛡️',
      title: '99.9% Uptime Guarantee',
      description: 'Reliable infrastructure ke sath maximum uptime, aapki website hamesha online rahe.',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    {
      icon: '🔐',
      title: 'Free SSL Certificate',
      description: 'Free SSL ke sath secure connections, data protection aur better Google ranking.',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      icon: '💬',
      title: '24/7 Expert Technical Support',
      description: 'Round-the-clock support via chat & ticket, UAE time ke mutabiq fast response.',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      icon: '📊',
      title: 'Scalable Hosting Plans',
      description: 'Traffic barhne par easily resources upgrade kar sakte ho bina downtime ke.',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h2>✨ Our Features</h2>
        <p>Why choose Daimond Host for your Minecraft server?</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon" style={{background: feature.gradient}}>
              <span>{feature.icon}</span>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="extra-info" style={{marginTop: '40px'}}>
        <h4>🎮 Perfect for Minecraft Servers</h4>
        <ul>
          <li>Optimized for Minecraft Java & Bedrock Edition</li>
          <li>Support for all popular server types (Paper, Spigot, Forge, Fabric)</li>
          <li>One-click modpack installation</li>
          <li>Automatic server backups</li>
          <li>Custom JAR support</li>
          <li>Subdomain included with every plan</li>
        </ul>
      </div>
    </div>
  );
};

export default Features;
