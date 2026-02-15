# DogWaterDev Portfolio - API Integration Update

## Overview
Updated the portfolio to dynamically fetch data from the getmy.name API with localStorage caching and fallback support.

## Changes Made

### 1. **API Integration** (`assets/js/script.js`)
- Fetches profile data from `https://getmy.name/get/DogWaterDev/data`
- Implements localStorage caching with 1-hour expiration
- Automatic fallback to static data if API fails
- Updates all dynamic content sections

### 2. **Dynamic Content Sections**
The following sections now update from API data:
- Hero section (name, bio, location, avatar)
- Projects grid (title, description, URL, tags)
- Tech stack badges (skills array)
- Social links (email, GitHub)
- Footer links
- API request counter

### 3. **New Features**
- **API Request Counter**: Displays in footer corner (bottom-right on desktop, centered on mobile)
- **Powered By**: Added "Powered by getmy.name from mtex.dev" attribution in footer
- **Smart Caching**: Reduces API calls by caching for 1 hour
- **Graceful Degradation**: Falls back to static content if API unavailable

### 4. **Styling Updates** (`assets/css/style.css`)
Added new styles for:
- `.api-powered` - Attribution text styling
- `.api-counter` - API request counter badge
- `.counter-label` and `.counter-value` - Counter components
- Responsive positioning for mobile devices

## How It Works

### Caching Logic
```javascript
1. Check localStorage for cached data
2. If cache exists and < 1 hour old → Use cached data
3. If cache missing or expired → Fetch from API
4. If API fails → Use cache or fallback data
5. Store successful API response in cache
```

### Data Mapping
- `data.username` / `data.name` → Hero name
- `data.bio` → Hero bio text
- `data.location` → Location highlight
- `data.avatar_url` → Profile picture
- `data.email` → Email links
- `data.socials.github` → GitHub links
- `data.skills[]` → Tech stack badges
- `data.projects[]` → Project cards
- `data.api_request_count` → Request counter

## File Structure
```
/
├── index.html              (Updated with dynamic IDs)
├── assets/
│   ├── css/
│   │   └── style.css      (Added API counter styles)
│   └── js/
│       └── script.js      (New API integration logic)
```

## API Response Structure
The portfolio expects this JSON structure from the API:
```json
{
  "name": "string",
  "username": "string",
  "bio": "string",
  "location": "string",
  "avatar_url": "string",
  "email": "string",
  "skills": ["string"],
  "projects": [{
    "title": "string",
    "description": "string",
    "url": "string | null"
  }],
  "socials": {
    "github": "string",
    "personal_website": "string"
  },
  "api_request_count": number
}
```

## Testing
1. Open browser DevTools → Network tab
2. Load page and verify API call to getmy.name
3. Refresh - should use cached data (no new API call)
4. Wait 1 hour or clear localStorage → New API call on refresh
5. Block API domain → Should fallback to static data

## Browser Compatibility
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses localStorage API (supported everywhere)
- CSS uses modern features (rgb from, custom properties)

## Notes
- Minimal comments in code as requested
- Maintains all original design aesthetics
- Zero breaking changes to existing functionality
- API counter updates on each page load
- Cache invalidation is automatic after 1 hour