// Initial event data structured by game flow
const initialEvents = [
    // 1. Authentication & Connection
    {
        id: 'connect',
        name: 'connect',
        direction: 'Client → Server',
        category: 'Authentication & Connection',
        description: 'Initial socket connection with auth token',
        status: 'completed',
        priority: 'critical',
        notes: '',
        order: 1
    },
    {
        id: 'login-success',
        name: 'login-success',
        direction: 'Server → Client',
        category: 'Authentication & Connection',
        description: 'Authentication successful, user data returned',
        status: 'completed',
        priority: 'critical',
        notes: '',
        order: 2
    },
    {
        id: 'error',
        name: 'error',
        direction: 'Server → Client',
        category: 'Authentication & Connection',
        description: 'Authentication/connection error',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 3
    },

    // 2. Table Management
    {
        id: 'get-tables',
        name: 'get-tables',
        direction: 'Client → Server',
        category: 'Table Management',
        description: 'Request available tables',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 4
    },
    {
        id: 'tables-list',
        name: 'tables-list',
        direction: 'Server → Client',
        category: 'Table Management',
        description: 'List of available tables returned',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 5
    },
    {
        id: 'create-table',
        name: 'create-table',
        direction: 'Client → Server',
        category: 'Table Management',
        description: 'Create a new table',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 6
    },
    {
        id: 'table-created',
        name: 'table-created',
        direction: 'Server → Client',
        category: 'Table Management',
        description: 'Table creation confirmation',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 7
    },
    {
        id: 'join-table',
        name: 'join-table',
        direction: 'Client → Server',
        category: 'Table Management',
        description: 'Request to join existing table',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 8
    },
    {
        id: 'joined-table',
        name: 'joined-table',
        direction: 'Server → Client',
        category: 'Table Management',
        description: 'Joined table confirmation with data',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 9
    },
    {
        id: 'table-updated',
        name: 'table-updated',
        direction: 'Server → Client',
        category: 'Table Management',
        description: 'Table data updated (players, settings)',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 10
    },
    {
        id: 'add-bot',
        name: 'add-bot',
        direction: 'Client → Server',
        category: 'Table Management',
        description: 'Add AI player to table',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 11
    },
    {
        id: 'player-ready',
        name: 'player-ready',
        direction: 'Client → Server',
        category: 'Table Management',
        description: 'Mark player as ready to start game',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 12
    },

    // 3. Game Preparation
    {
        id: 'start-game',
        name: 'start-game',
        direction: 'Server → Client',
        category: 'Game Preparation',
        description: 'Game preparation complete, ready to start',
        status: 'completed',
        priority: 'critical',
        notes: '',
        order: 13
    },
    {
        id: 'game-started',
        name: 'game-started',
        direction: 'Client → Server',
        category: 'Game Preparation',
        description: 'Client confirms game scene is loaded',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 14
    },

    // 4. Round Start & Tile Distribution
    {
        id: 'distribute-tiles',
        name: 'distribute-tiles',
        direction: 'Server → Client',
        category: 'Round Start & Tile Distribution',
        description: 'Initial tiles given to players',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 15
    },
    {
        id: 'tiles-distributed',
        name: 'tiles-distributed',
        direction: 'Client → Server',
        category: 'Round Start & Tile Distribution',
        description: 'Client confirms tiles received',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 16
    },
    {
        id: 'start-round',
        name: 'start-round',
        direction: 'Server → Client',
        category: 'Round Start & Tile Distribution',
        description: 'Round is officially starting',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 17
    },
    {
        id: 'roundStarted',
        name: 'roundStarted',
        direction: 'Client → Server',
        category: 'Round Start & Tile Distribution',
        description: 'Client confirms round started',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 18
    },

    // 5. Core Gameplay Loop
    {
        id: 'start-turn',
        name: 'start-turn',
        direction: 'Server → Client',
        category: 'Core Gameplay Loop',
        description: "Player's turn notification",
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 19
    },
    {
        id: 'turnAcknowledged',
        name: 'turnAcknowledged',
        direction: 'Client → Server',
        category: 'Core Gameplay Loop',
        description: 'Client confirms turn started',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 20
    },
    {
        id: 'draw-tile',
        name: 'draw-tile',
        direction: 'Client → Server',
        category: 'Core Gameplay Loop',
        description: 'Request to draw a tile from wall',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 21
    },
    {
        id: 'tile-drawn',
        name: 'tile-drawn',
        direction: 'Server → Client',
        category: 'Core Gameplay Loop',
        description: 'Tile drawn from wall',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 22
    },
    {
        id: 'player-drew-tile',
        name: 'player-drew-tile',
        direction: 'Server → Client',
        category: 'Core Gameplay Loop',
        description: 'Another player drew a tile',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 23
    },
    {
        id: 'hand-updated',
        name: 'hand-updated',
        direction: 'Server → Client',
        category: 'Core Gameplay Loop',
        description: 'Hand content changed',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 24
    },
    {
        id: 'discard-tile',
        name: 'discard-tile',
        direction: 'Client → Server',
        category: 'Core Gameplay Loop',
        description: 'Discard a tile from hand',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 25
    },
    {
        id: 'tile-discarded',
        name: 'tile-discarded',
        direction: 'Server → Client',
        category: 'Core Gameplay Loop',
        description: 'Tile discarded notification',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 26
    },
    {
        id: 'turn-update',
        name: 'turn-update',
        direction: 'Server → Client',
        category: 'Core Gameplay Loop',
        description: 'Turn passed to next player',
        status: 'not-started',
        priority: 'critical',
        notes: '',
        order: 27
    },

    // 6. Bonus Tiles
    {
        id: 'bonus-tile-drawn',
        name: 'bonus-tile-drawn',
        direction: 'Server → Client',
        category: 'Bonus Tiles',
        description: 'Drew a bonus tile (flower/season/animal)',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 28
    },
    {
        id: 'player-drew-bonus-tile',
        name: 'player-drew-bonus-tile',
        direction: 'Server → Client',
        category: 'Bonus Tiles',
        description: 'Other player drew a bonus tile',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 29
    },

    // 7. Claiming Actions
    {
        id: 'opportunity-chow',
        name: 'opportunity-chow',
        direction: 'Server → Client',
        category: 'Claiming Actions',
        description: 'Can claim discarded tile for chow',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 30
    },
    {
        id: 'chowDecision',
        name: 'chowDecision',
        direction: 'Client → Server',
        category: 'Claiming Actions',
        description: 'Decision to chow or pass',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 31
    },
    {
        id: 'opportunity-pong',
        name: 'opportunity-pong',
        direction: 'Server → Client',
        category: 'Claiming Actions',
        description: 'Can claim for pong',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 32
    },
    {
        id: 'pongDecision',
        name: 'pongDecision',
        direction: 'Client → Server',
        category: 'Claiming Actions',
        description: 'Decision to pong or pass',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 33
    },
    {
        id: 'opportunity-kong',
        name: 'opportunity-kong',
        direction: 'Server → Client',
        category: 'Claiming Actions',
        description: 'Can claim for kong',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 34
    },
    {
        id: 'kongDecision',
        name: 'kongDecision',
        direction: 'Client → Server',
        category: 'Claiming Actions',
        description: 'Decision to kong or pass',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 35
    },
    {
        id: 'opportunity-hu',
        name: 'opportunity-hu',
        direction: 'Server → Client',
        category: 'Claiming Actions',
        description: 'Can claim for win',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 36
    },
    {
        id: 'declareHu',
        name: 'declareHu',
        direction: 'Client → Server',
        category: 'Claiming Actions',
        description: 'Declare win on discarded tile',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 37
    },
    {
        id: 'tile-claimed',
        name: 'tile-claimed',
        direction: 'Server → Client',
        category: 'Claiming Actions',
        description: 'Tile was claimed',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 38
    },

    // 8. Self Actions
    {
        id: 'declareConcealedKong',
        name: 'declareConcealedKong',
        direction: 'Client → Server',
        category: 'Self Actions',
        description: 'Declare kong from hand',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 39
    },
    {
        id: 'concealed-kong-declared',
        name: 'concealed-kong-declared',
        direction: 'Server → Client',
        category: 'Self Actions',
        description: 'Kong declared from hand',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 40
    },
    {
        id: 'can-win',
        name: 'can-win',
        direction: 'Server → Client',
        category: 'Self Actions',
        description: 'Notification player can self-draw win',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 41
    },
    {
        id: 'kong-or-win-choice',
        name: 'kong-or-win-choice',
        direction: 'Server → Client',
        category: 'Self Actions',
        description: 'Choose between declaring kong or win',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 42
    },

    // 9. Round Completion
    {
        id: 'round-ended',
        name: 'round-ended',
        direction: 'Server → Client',
        category: 'Round Completion',
        description: 'Round has ended (win or draw)',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 43
    },
    {
        id: 'roundEnded',
        name: 'roundEnded',
        direction: 'Client → Server',
        category: 'Round Completion',
        description: 'Client acknowledges round end',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 44
    },

    // 10. Multiple Rounds
    {
        id: 'prepare-next-round',
        name: 'prepare-next-round',
        direction: 'Server → Client',
        category: 'Multiple Rounds',
        description: 'Prepare for next round',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 45
    },
    {
        id: 'nextRoundReady',
        name: 'nextRoundReady',
        direction: 'Client → Server',
        category: 'Multiple Rounds',
        description: 'Client ready for next round',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 46
    },
    {
        id: 'game-ended',
        name: 'game-ended',
        direction: 'Server → Client',
        category: 'Multiple Rounds',
        description: 'All rounds complete, game over',
        status: 'not-started',
        priority: 'high',
        notes: '',
        order: 47
    },
    {
        id: 'gameEndAcknowledged',
        name: 'gameEndAcknowledged',
        direction: 'Client → Server',
        category: 'Multiple Rounds',
        description: 'Client acknowledges game end',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 48
    },

    // 11. Disconnection & Reconnection
    {
        id: 'disconnect',
        name: 'disconnect',
        direction: 'Client → Server',
        category: 'Disconnection & Reconnection',
        description: 'Planned disconnection',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 49
    },
    {
        id: 'player-disconnected',
        name: 'player-disconnected',
        direction: 'Server → Client',
        category: 'Disconnection & Reconnection',
        description: 'Another player disconnected',
        status: 'not-started',
        priority: 'medium',
        notes: '',
        order: 50
    },
    {
        id: 'reconnect-attempt',
        name: 'reconnect-attempt',
        direction: 'Client → Server',
        category: 'Disconnection & Reconnection',
        description: 'Try to rejoin ongoing game',
        status: 'not-started',
        priority: 'low',
        notes: '',
        order: 51
    },
    {
        id: 'reconnect-success',
        name: 'reconnect-success',
        direction: 'Server → Client',
        category: 'Disconnection & Reconnection',
        description: 'Reconnection succeeded',
        status: 'not-started',
        priority: 'low',
        notes: '',
        order: 52
    },
    {
        id: 'reconnect-failed',
        name: 'reconnect-failed',
        direction: 'Server → Client',
        category: 'Disconnection & Reconnection',
        description: 'Reconnection failed',
        status: 'not-started',
        priority: 'low',
        notes: '',
        order: 53
    },
    {
        id: 'reconnectComplete',
        name: 'reconnectComplete',
        direction: 'Client → Server',
        category: 'Disconnection & Reconnection',
        description: 'Client completed reconnection',
        status: 'not-started',
        priority: 'low',
        notes: '',
        order: 54
    },
    {
        id: 'player-reconnected',
        name: 'player-reconnected',
        direction: 'Server → Client',
        category: 'Disconnection & Reconnection',
        description: 'Another player reconnected',
        status: 'not-started',
        priority: 'low',
        notes: '',
        order: 55
    },

    // 12. Table Exit
    {
        id: 'leave-table',
        name: 'leave-table',
        direction: 'Client → Server',
        category: 'Table Exit',
        description: 'Request to leave table',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 56
    },
    {
        id: 'left-table',
        name: 'left-table',
        direction: 'Server → Client',
        category: 'Table Exit',
        description: 'Left table confirmation',
        status: 'completed',
        priority: 'high',
        notes: '',
        order: 57
    },
    {
        id: 'player-left-game',
        name: 'player-left-game',
        direction: 'Server → Client',
        category: 'Table Exit',
        description: 'Player abandoned ongoing game',
        status: 'not-started',
        priority: 'low',
        notes: '',
        order: 58
    },
    {
        id: 'table-removed',
        name: 'table-removed',
        direction: 'Server → Client',
        category: 'Table Exit',
        description: 'Table has been deleted',
        status: 'not-started',
        priority: 'low',
        notes: '',
        order: 59
    },
];