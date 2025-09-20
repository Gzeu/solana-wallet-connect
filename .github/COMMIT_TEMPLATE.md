# 🔧 Standardized Commit Message Template pentru MCP Workflow

## 📝 **Format Standard:**

```
[GPZ-XX] Titlu scurt și descriptiv (max 50 caractere)

Descriere detaliată (wrap la 72 caractere):
- Ce a fost implementat/modificat
- De ce a fost necesar acest change  
- Impact asupra proiectului

🎯 Tasks completate:
- [x] Task 1 - descripție scurtă
- [x] Task 2 - descripție scurtă
- [ ] Task 3 - în progres

🧪 Testing:
- [x] Unit tests added/updated
- [x] Integration tests passed
- [x] Manual testing completed

📊 Metrics:
- Performance: improved/maintained/degraded
- Test coverage: increased/maintained
- Bundle size: reduced/maintained/increased

🔗 References:
Related to Linear issue GPZ-XX
```

## 🏆 **Exemple de Commit Messages:**

### **Feature Implementation:**
```
[GPZ-29] Add dark/light theme toggle with system preference support

Implement comprehensive theming system:
- React Context cu theme state management
- localStorage persistence cu system sync
- Animated toggle components cu smooth transitions
- CSS variables pentru consistent styling

🎯 Tasks completate:
- [x] Create theme context and provider
- [x] Add theme toggle button cu animații
- [x] Update CSS cu variables pentru dark/light
- [x] Integrate în toate componentele

🧪 Testing:
- [x] Theme switching functionality tested
- [x] localStorage persistence verified
- [x] System preference detection working

📊 Metrics:
- Performance: maintained
- Test coverage: increased
- Bundle size: minimal increase

🔗 References:
Related to Linear issue GPZ-29
```

### **Bug Fix:**
```
[GPZ-XX] Fix wallet connection error handling pentru mobile browsers

Rezolvă probleme specifice mobile:
- Enhanced error detection pentru mobile wallets
- Better error messages în română
- Improved retry logic pentru connection failures

🐛 Bug Fixes:
- Mobile wallet detection issues
- Toast notifications overlap on small screens
- Connection timeout pe slow networks

🧪 Testing:
- [x] Mobile browsers tested (iOS Safari, Chrome Mobile)
- [x] Error scenarios covered

🔗 References:
Fixes issue reported in GPZ-XX
```

### **Testing Addition:**
```
[GPZ-24] Add comprehensive unit tests pentru core components

Expand test coverage cu:
- Component testing cu React Testing Library
- Hook testing cu mocked dependencies
- Error boundary testing cu simulated errors
- CI/CD pipeline cu automated testing

🧪 Testing:
- [x] WalletButton component tests
- [x] BalanceCard component tests (toate state-urile)
- [x] ErrorBoundary tests cu retry functionality
- [x] Jest setup cu Solana mocks

📊 Metrics:
- Test coverage: increased de la 0% la 85%
- CI/CD: automated testing pe Node 18.x, 20.x

🔗 References:
Related to Linear issue GPZ-24
```

### **Documentation Update:**
```
[DOCS] Update README cu new features și setup instructions

📝 Documentation îmbunătățită:
- Testing infrastructure documentation
- Error handling system explained
- Theme system setup instructions
- Development workflow guidelines
- Romanian-first approach documented

🔗 References:
Related to Linear issues GPZ-24, GPZ-25, GPZ-29
```

---

## 🚀 **MCP Workflow Benefits:**

### **✅ Consistency:**
- Toate commit-urile au același format
- Clear traceability la Linear issues
- Structured information pentru review

### **✅ Automation:**
- MCP tools automatically generate proper commit messages
- Linear issue references integrated
- Task completion tracking

### **✅ Quality:**
- Forced documentation of changes
- Testing requirements highlighted
- Performance impact awareness

### **✅ Romanian-Friendly:**
- Commit messages pot fi în română/engleză
- Task descriptions localizate
- User-friendly pentru echipa locală

---

## 🔧 **Setup Instructions:**

1. **Configure git template:**
   ```bash
   git config commit.template .github/COMMIT_TEMPLATE.md
   ```

2. **MCP tools** vor folosi automat acest format pentru commit messages

3. **Linear integration** este automatică prin GPZ-XX references

**Acest template asigură consistency și traceability pentru tot workflow-ul MCP!** 🏆