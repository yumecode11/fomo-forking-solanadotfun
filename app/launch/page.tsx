"use client";

import { Button, Checkbox, Divider, Input, Link, PopoverTrigger, Popover, Textarea, PopoverContent, SelectItem, Select } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useForm, useField, Updater } from "@tanstack/react-form";

// Images
import RaydiumLogo from "@/app/assets/images/f3d.gif";
import GobblerLogo from "@/app/assets/images/gobbler.png";
import { Icon } from "@iconify/react";
import DexOption from "@/components/dex-option";
import { createJupiterApiClient } from "@jup-ag/api";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { CREATE_CPMM_POOL_PROGRAM, getCreatePoolKeys, makeCreateCpmmPoolInInstruction, makeInitializeMetadata, METADATA_PROGRAM_ID, TokenInfo } from "tokengobbler";
import { ComputeBudgetProgram, Connection, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, VersionedTransaction } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { BN } from "bn.js";
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
const IDL = {
	"address": "65YAWs68bmR2RpQrs2zyRNTum2NRrdWzUfUTew9kydN9",
	"metadata": {
	  "name": "curve_launchpad",
	  "version": "0.1.0",
	  "spec": "0.1.0",
	  "description": "Created with Anchor"
	},
	"instructions": [
	  {
		"name": "bribe_metadata",
		"discriminator": [
		  104,
		  12,
		  2,
		  9,
		  237,
		  241,
		  40,
		  212
		],
		"accounts": [
		  {
			"name": "authority",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "token_program_2022"
		  },
		  {
			"name": "mint_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					109,
					105,
					110,
					116,
					45,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "hydra",
			"writable": true
		  },
		  {
			"name": "claimer",
			"writable": true
		  },
		  {
			"name": "bribe",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					114,
					105,
					98,
					101
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": [
		  {
			"name": "uri",
			"type": "string"
		  },
		  {
			"name": "amount",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "buy",
		"discriminator": [
		  102,
		  6,
		  61,
		  18,
		  1,
		  218,
		  235,
		  234
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "bonding_curve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "bonding_curve_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "bonding_curve"
				},
				{
				  "kind": "account",
				  "path": "token_program"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "user_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "token_program"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "token_program"
		  },
		  {
			"name": "sysvar_recent_slothashes",
			"address": "SysvarRecentB1ockHashes11111111111111111111"
		  },
		  {
			"name": "hydra",
			"writable": true
		  },
		  {
			"name": "event_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "token_amount",
			"type": "u64"
		  },
		  {
			"name": "max_sol_cost",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "buy_2",
		"discriminator": [
		  4,
		  176,
		  214,
		  132,
		  174,
		  243,
		  158,
		  188
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "bonding_curve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "user_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "token_program"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "token_program"
		  },
		  {
			"name": "event_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "lp_token_amount",
			"type": "u64"
		  },
		  {
			"name": "lamports",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "create",
		"discriminator": [
		  24,
		  30,
		  200,
		  40,
		  5,
		  28,
		  7,
		  119
		],
		"accounts": [
		  {
			"name": "mint",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "creator",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "mint_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					109,
					105,
					110,
					116,
					45,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "bonding_curve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "bonding_curve_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "bonding_curve"
				},
				{
				  "kind": "account",
				  "path": "token_program_2022"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "associated_token_program",
			"address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
		  },
		  {
			"name": "rent",
			"address": "SysvarRent111111111111111111111111111111111"
		  },
		  {
			"name": "token_program_2022"
		  },
		  {
			"name": "event_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "name",
			"type": "string"
		  },
		  {
			"name": "symbol",
			"type": "string"
		  },
		  {
			"name": "uri",
			"type": "string"
		  }
		]
	  },
	  {
		"name": "initialize",
		"discriminator": [
		  175,
		  175,
		  109,
		  31,
		  13,
		  152,
		  155,
		  237
		],
		"accounts": [
		  {
			"name": "authority",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": []
	  },
	  {
		"name": "migrate",
		"discriminator": [
		  155,
		  234,
		  231,
		  146,
		  236,
		  158,
		  162,
		  30
		],
		"accounts": [
		  {
			"name": "creator",
			"docs": [
			  "Address paying to create the pool. Can be anyone"
			],
			"writable": true,
			"signer": true
		  },
		  {
			"name": "amm_config"
		  },
		  {
			"name": "authority"
		  },
		  {
			"name": "pool_state",
			"writable": true
		  },
		  {
			"name": "wsol_mint",
			"docs": [
			  "WSOL mint"
			],
			"address": "So11111111111111111111111111111111111111112"
		  },
		  {
			"name": "token_mint",
			"docs": [
			  "Token mint, the key must grater then token_0 mint."
			]
		  },
		  {
			"name": "lp_mint",
			"writable": true
		  },
		  {
			"name": "creator_wsol_account",
			"docs": [
			  "payer token0 account"
			],
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "creator"
				},
				{
				  "kind": "const",
				  "value": [
					6,
					221,
					246,
					225,
					215,
					101,
					161,
					147,
					217,
					203,
					225,
					70,
					206,
					235,
					121,
					172,
					28,
					180,
					133,
					237,
					95,
					91,
					55,
					145,
					58,
					140,
					245,
					133,
					126,
					255,
					0,
					169
				  ]
				},
				{
				  "kind": "account",
				  "path": "wsol_mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "creator_token_account",
			"docs": [
			  "creator token1 account"
			],
			"writable": true
		  },
		  {
			"name": "creator_lp_token",
			"writable": true
		  },
		  {
			"name": "token_0_vault",
			"writable": true
		  },
		  {
			"name": "token_1_vault",
			"writable": true
		  },
		  {
			"name": "observation_state",
			"writable": true
		  },
		  {
			"name": "cp_swap_program"
		  },
		  {
			"name": "token_program",
			"docs": [
			  "Program to create mint account and mint tokens"
			]
		  },
		  {
			"name": "token_program_2022",
			"docs": [
			  "Program to create mint account and mint tokens"
			]
		  },
		  {
			"name": "associated_token_program",
			"docs": [
			  "Program to create an ATA for receiving position NFT"
			],
			"address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
		  },
		  {
			"name": "system_program",
			"docs": [
			  "To create a new program account"
			],
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "rent",
			"docs": [
			  "Sysvar for program account"
			],
			"address": "SysvarRent111111111111111111111111111111111"
		  },
		  {
			"name": "token_metadata_program"
		  },
		  {
			"name": "metadata",
			"docs": [
			  "Token metadata program"
			],
			"writable": true
		  },
		  {
			"name": "create_pool_fee",
			"writable": true
		  },
		  {
			"name": "hydra",
			"writable": true
		  },
		  {
			"name": "global",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  }
		],
		"args": [
		  {
			"name": "raydium",
			"type": "bool"
		  },
		  {
			"name": "init_amount_1",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "process_burn_time_lock",
		"discriminator": [
		  88,
		  166,
		  4,
		  8,
		  194,
		  137,
		  82,
		  173
		],
		"accounts": [
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "token_account",
			"writable": true
		  },
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "token_program",
			"address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
		  },
		  {
			"name": "token_program_2022",
			"address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
		  },
		  {
			"name": "pool_state"
		  },
		  {
			"name": "token_0_vault",
			"writable": true
		  },
		  {
			"name": "token_1_vault",
			"writable": true
		  },
		  {
			"name": "fee_tier",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					102,
					101,
					101,
					95,
					116,
					105,
					101,
					114
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				},
				{
				  "kind": "arg",
				  "path": "tier"
				}
			  ]
			}
		  },
		  {
			"name": "time_lock_token",
			"writable": true
		  },
		  {
			"name": "time_lock_token_account",
			"writable": true
		  }
		],
		"args": [
		  {
			"name": "tier",
			"type": {
			  "defined": {
				"name": "MarketCapTier"
			  }
			}
		  },
		  {
			"name": "amount",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "process_init_time_locks",
		"discriminator": [
		  13,
		  82,
		  225,
		  110,
		  118,
		  248,
		  243,
		  190
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "token_program",
			"address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "fee_tier",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					102,
					101,
					101,
					95,
					116,
					105,
					101,
					114
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				},
				{
				  "kind": "arg",
				  "path": "tier"
				}
			  ]
			}
		  }
		],
		"args": [
		  {
			"name": "tier",
			"type": {
			  "defined": {
				"name": "MarketCapTier"
			  }
			}
		  }
		]
	  },
	  {
		"name": "process_initialize_time_lock",
		"discriminator": [
		  75,
		  217,
		  157,
		  70,
		  176,
		  104,
		  183,
		  255
		],
		"accounts": [
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "token_program",
			"address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
		  },
		  {
			"name": "token_vault",
			"writable": true
		  },
		  {
			"name": "token_account",
			"writable": true
		  },
		  {
			"name": "fee_tier",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					102,
					101,
					101,
					95,
					116,
					105,
					101,
					114
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				},
				{
				  "kind": "arg",
				  "path": "tier"
				}
			  ]
			}
		  },
		  {
			"name": "time_lock_token",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "time_lock_token_account",
			"writable": true,
			"signer": true
		  }
		],
		"args": [
		  {
			"name": "tier",
			"type": {
			  "defined": {
				"name": "MarketCapTier"
			  }
			}
		  },
		  {
			"name": "amount",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "renounce_authority",
		"discriminator": [
		  78,
		  110,
		  117,
		  127,
		  89,
		  23,
		  253,
		  153
		],
		"accounts": [
		  {
			"name": "authority",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "token_program_2022"
		  },
		  {
			"name": "mint_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					109,
					105,
					110,
					116,
					45,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  }
		],
		"args": []
	  },
	  {
		"name": "sell",
		"discriminator": [
		  51,
		  230,
		  133,
		  164,
		  1,
		  127,
		  131,
		  173
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "bonding_curve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "bonding_curve_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "bonding_curve"
				},
				{
				  "kind": "account",
				  "path": "token_program"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "user_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "token_program"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "token_program"
		  },
		  {
			"name": "hydra",
			"writable": true
		  },
		  {
			"name": "event_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "token_amount",
			"type": "u64"
		  },
		  {
			"name": "min_sol_output",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "sell_2",
		"discriminator": [
		  53,
		  138,
		  160,
		  216,
		  205,
		  51,
		  57,
		  120
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "bonding_curve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "user_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "token_program"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "token_program"
		  },
		  {
			"name": "event_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "lp_token_amount",
			"type": "u64"
		  },
		  {
			"name": "sell_result",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "set_params",
		"discriminator": [
		  27,
		  234,
		  178,
		  52,
		  147,
		  2,
		  187,
		  141
		],
		"accounts": [
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "user",
			"signer": true
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "event_authority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "fee_recipient",
			"type": "pubkey"
		  },
		  {
			"name": "withdraw_authority",
			"type": "pubkey"
		  },
		  {
			"name": "initial_virtual_token_reserves",
			"type": "u64"
		  },
		  {
			"name": "initial_virtual_sol_reserves",
			"type": "u64"
		  },
		  {
			"name": "initial_real_token_reserves",
			"type": "u64"
		  },
		  {
			"name": "inital_token_supply",
			"type": "u64"
		  },
		  {
			"name": "fee_basis_points",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "withdraw",
		"discriminator": [
		  183,
		  18,
		  70,
		  156,
		  148,
		  109,
		  161,
		  34
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "last_withdraw",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					108,
					97,
					115,
					116,
					45,
					119,
					105,
					116,
					104,
					100,
					114,
					97,
					119
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "bonding_curve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "bonding_curve_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "bonding_curve"
				},
				{
				  "kind": "account",
				  "path": "token_program"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "user_token_account",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "token_program"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "associated_token_program",
			"address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
		  },
		  {
			"name": "system_program",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "token_program"
		  }
		],
		"args": []
	  }
	],
	"accounts": [
	  {
		"name": "BondingCurve",
		"discriminator": [
		  23,
		  183,
		  248,
		  55,
		  96,
		  216,
		  172,
		  96
		]
	  },
	  {
		"name": "Bribe",
		"discriminator": [
		  123,
		  25,
		  44,
		  23,
		  111,
		  217,
		  65,
		  73
		]
	  },
	  {
		"name": "FeeTier",
		"discriminator": [
		  56,
		  75,
		  159,
		  76,
		  142,
		  68,
		  190,
		  105
		]
	  },
	  {
		"name": "Global",
		"discriminator": [
		  167,
		  232,
		  232,
		  177,
		  200,
		  108,
		  114,
		  127
		]
	  },
	  {
		"name": "LastWithdraw",
		"discriminator": [
		  203,
		  18,
		  220,
		  103,
		  120,
		  145,
		  187,
		  2
		]
	  },
	  {
		"name": "PoolState",
		"discriminator": [
		  247,
		  237,
		  227,
		  245,
		  215,
		  195,
		  222,
		  70
		]
	  }
	],
	"events": [
	  {
		"name": "CompleteEvent",
		"discriminator": [
		  95,
		  114,
		  97,
		  156,
		  212,
		  46,
		  152,
		  8
		]
	  },
	  {
		"name": "CreateEvent",
		"discriminator": [
		  27,
		  114,
		  169,
		  77,
		  222,
		  235,
		  99,
		  118
		]
	  },
	  {
		"name": "SetParamsEvent",
		"discriminator": [
		  223,
		  195,
		  159,
		  246,
		  62,
		  48,
		  143,
		  131
		]
	  },
	  {
		"name": "TradeEvent",
		"discriminator": [
		  189,
		  219,
		  127,
		  211,
		  78,
		  230,
		  97,
		  238
		]
	  }
	],
	"errors": [
	  {
		"code": 6000,
		"name": "AlreadyInitialized",
		"msg": "Global Already Initialized"
	  },
	  {
		"code": 6001,
		"name": "NotInitialized",
		"msg": "Global Not Initialized"
	  },
	  {
		"code": 6002,
		"name": "InvalidAuthority",
		"msg": "Invalid Authority"
	  },
	  {
		"code": 6003,
		"name": "BondingCurveComplete",
		"msg": "Bonding Curve Complete"
	  },
	  {
		"code": 6004,
		"name": "BondingCurveNotComplete",
		"msg": "Bonding Curve Not Complete"
	  },
	  {
		"code": 6005,
		"name": "InsufficientTokens",
		"msg": "Insufficient Tokens"
	  },
	  {
		"code": 6006,
		"name": "InsufficientSOL",
		"msg": "Insufficient SOL"
	  },
	  {
		"code": 6007,
		"name": "MaxSOLCostExceeded",
		"msg": "Max SOL Cost Exceeded"
	  },
	  {
		"code": 6008,
		"name": "MinSOLOutputExceeded",
		"msg": "Min SOL Output Exceeded"
	  },
	  {
		"code": 6009,
		"name": "MinBuy",
		"msg": "Min buy is 1 Token"
	  },
	  {
		"code": 6010,
		"name": "MinSell",
		"msg": "Min sell is 1 Token"
	  },
	  {
		"code": 6011,
		"name": "InvalidFeeRecipient",
		"msg": "Invalid Fee Recipient"
	  },
	  {
		"code": 6012,
		"name": "InvalidWithdrawAuthority",
		"msg": "Invalid Withdraw Authority"
	  },
	  {
		"code": 6013,
		"name": "BribeNotExpired",
		"msg": "Bribe Not Expired"
	  },
	  {
		"code": 6014,
		"name": "NotLastBriber",
		"msg": "Not Last Briber"
	  },
	  {
		"code": 6015,
		"name": "BribeOverflow",
		"msg": "Bribe Overflow"
	  },
	  {
		"code": 6016,
		"name": "MultipleBuy2Instructions",
		"msg": "Multiple Buy2 Instructions"
	  },
	  {
		"code": 6017,
		"name": "InvalidBuy2Instruction",
		"msg": "Invalid Buy2 Instruction"
	  },
	  {
		"code": 6018,
		"name": "NoBuy2InstructionFound",
		"msg": "No Buy2 Instruction Found"
	  },
	  {
		"code": 6019,
		"name": "MultipleBuyInstructions",
		"msg": "Multiple Buy Instructions"
	  },
	  {
		"code": 6020,
		"name": "InvalidBuy2",
		"msg": "Invalid Buy Instruction"
	  }
	],
	"types": [
	  {
		"name": "AMM",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "virtual_sol_reserves",
			  "type": "u128"
			},
			{
			  "name": "virtual_token_reserves",
			  "type": "u128"
			},
			{
			  "name": "real_sol_reserves",
			  "type": "u128"
			},
			{
			  "name": "real_token_reserves",
			  "type": "u128"
			},
			{
			  "name": "initial_virtual_token_reserves",
			  "type": "u128"
			}
		  ]
		}
	  },
	  {
		"name": "BondingCurve",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "virtual_sol_reserves",
			  "type": "u64"
			},
			{
			  "name": "virtual_token_reserves",
			  "type": "u64"
			},
			{
			  "name": "real_sol_reserves",
			  "type": "u64"
			},
			{
			  "name": "real_token_reserves",
			  "type": "u64"
			},
			{
			  "name": "token_total_supply",
			  "type": "u64"
			},
			{
			  "name": "complete",
			  "type": "bool"
			}
		  ]
		}
	  },
	  {
		"name": "Bribe",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "amount",
			  "type": "u64"
			},
			{
			  "name": "last_briber",
			  "type": "pubkey"
			},
			{
			  "name": "pot",
			  "type": "u64"
			},
			{
			  "name": "timer_start",
			  "type": "i64"
			},
			{
			  "name": "timer_end",
			  "type": "i64"
			}
		  ]
		}
	  },
	  {
		"name": "CompleteEvent",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "user",
			  "type": "pubkey"
			},
			{
			  "name": "mint",
			  "type": "pubkey"
			},
			{
			  "name": "bonding_curve",
			  "type": "pubkey"
			},
			{
			  "name": "timestamp",
			  "type": "i64"
			}
		  ]
		}
	  },
	  {
		"name": "CreateEvent",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "name",
			  "type": "string"
			},
			{
			  "name": "symbol",
			  "type": "string"
			},
			{
			  "name": "uri",
			  "type": "string"
			},
			{
			  "name": "mint",
			  "type": "pubkey"
			},
			{
			  "name": "bonding_curve",
			  "type": "pubkey"
			},
			{
			  "name": "creator",
			  "type": "pubkey"
			}
		  ]
		}
	  },
	  {
		"name": "FeeTier",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "tier",
			  "type": {
				"defined": {
				  "name": "MarketCapTier"
				}
			  }
			},
			{
			  "name": "mint",
			  "type": "pubkey"
			}
		  ]
		}
	  },
	  {
		"name": "Global",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "authority",
			  "type": "pubkey"
			},
			{
			  "name": "initialized",
			  "type": "bool"
			},
			{
			  "name": "fee_recipient",
			  "type": "pubkey"
			},
			{
			  "name": "initial_virtual_token_reserves",
			  "type": "u64"
			},
			{
			  "name": "initial_virtual_sol_reserves",
			  "type": "u64"
			},
			{
			  "name": "initial_real_token_reserves",
			  "type": "u64"
			},
			{
			  "name": "initial_real_sol_reserves",
			  "type": "u64"
			},
			{
			  "name": "initial_token_supply",
			  "type": "u64"
			},
			{
			  "name": "fee_basis_points",
			  "type": "u64"
			},
			{
			  "name": "withdraw_authority",
			  "type": "pubkey"
			}
		  ]
		}
	  },
	  {
		"name": "LastWithdraw",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "last_withdraw_timestamp",
			  "type": "i64"
			}
		  ]
		}
	  },
	  {
		"name": "MarketCapTier",
		"type": {
		  "kind": "enum",
		  "variants": [
			{
			  "name": "OneMillion"
			},
			{
			  "name": "TwoMillion"
			},
			{
			  "name": "FourMillion"
			},
			{
			  "name": "EightMillion"
			},
			{
			  "name": "SixteenMillion"
			}
		  ]
		}
	  },
	  {
		"name": "PoolState",
		"serialization": "bytemuckunsafe",
		"repr": {
		  "kind": "rust",
		  "packed": true
		},
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "amm_config",
			  "docs": [
				"Which config the pool belongs"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "pool_creator",
			  "docs": [
				"pool creator"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token_0_vault",
			  "docs": [
				"Token A"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token_1_vault",
			  "docs": [
				"Token B"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "lp_mint",
			  "docs": [
				"Pool tokens are issued when A or B tokens are deposited.",
				"Pool tokens can be withdrawn back to the original A or B token."
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token_0_mint",
			  "docs": [
				"Mint information for token A"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token_1_mint",
			  "docs": [
				"Mint information for token B"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token_0_program",
			  "docs": [
				"token_0 program"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token_1_program",
			  "docs": [
				"token_1 program"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "observation_key",
			  "docs": [
				"observation account to store oracle data"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "auth_bump",
			  "type": "u8"
			},
			{
			  "name": "status",
			  "docs": [
				"Bitwise representation of the state of the pool",
				"bit0, 1: disable deposit(vaule is 1), 0: normal",
				"bit1, 1: disable withdraw(vaule is 2), 0: normal",
				"bit2, 1: disable swap(vaule is 4), 0: normal"
			  ],
			  "type": "u8"
			},
			{
			  "name": "lp_mint_decimals",
			  "type": "u8"
			},
			{
			  "name": "mint_0_decimals",
			  "docs": [
				"mint0 and mint1 decimals"
			  ],
			  "type": "u8"
			},
			{
			  "name": "mint_1_decimals",
			  "type": "u8"
			},
			{
			  "name": "lp_supply",
			  "docs": [
				"True circulating supply without burns and lock ups"
			  ],
			  "type": "u64"
			},
			{
			  "name": "protocol_fees_token_0",
			  "docs": [
				"The amounts of token_0 and token_1 that are owed to the liquidity provider."
			  ],
			  "type": "u64"
			},
			{
			  "name": "protocol_fees_token_1",
			  "type": "u64"
			},
			{
			  "name": "fund_fees_token_0",
			  "type": "u64"
			},
			{
			  "name": "fund_fees_token_1",
			  "type": "u64"
			},
			{
			  "name": "open_time",
			  "docs": [
				"The timestamp allowed for swap in the pool."
			  ],
			  "type": "u64"
			},
			{
			  "name": "recent_epoch",
			  "docs": [
				"recent epoch"
			  ],
			  "type": "u64"
			},
			{
			  "name": "amm",
			  "type": {
				"defined": {
				  "name": "AMM"
				}
			  }
			},
			{
			  "name": "safu_lp_supply",
			  "type": "u64"
			},
			{
			  "name": "token_0_vault_safu",
			  "docs": [
				"padding for future updates"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token_1_vault_safu",
			  "type": "pubkey"
			},
			{
			  "name": "padding",
			  "type": {
				"array": [
				  "u64",
				  22
				]
			  }
			}
		  ]
		}
	  },
	  {
		"name": "SetParamsEvent",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "fee_recipient",
			  "type": "pubkey"
			},
			{
			  "name": "withdraw_authority",
			  "type": "pubkey"
			},
			{
			  "name": "initial_virtual_token_reserves",
			  "type": "u64"
			},
			{
			  "name": "initial_virtual_sol_reserves",
			  "type": "u64"
			},
			{
			  "name": "initial_real_token_reserves",
			  "type": "u64"
			},
			{
			  "name": "initial_token_supply",
			  "type": "u64"
			},
			{
			  "name": "fee_basis_points",
			  "type": "u64"
			}
		  ]
		}
	  },
	  {
		"name": "TradeEvent",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "mint",
			  "type": "pubkey"
			},
			{
			  "name": "sol_amount",
			  "type": "u64"
			},
			{
			  "name": "token_amount",
			  "type": "u64"
			},
			{
			  "name": "is_buy",
			  "type": "bool"
			},
			{
			  "name": "user",
			  "type": "pubkey"
			},
			{
			  "name": "timestamp",
			  "type": "i64"
			},
			{
			  "name": "virtual_sol_reserves",
			  "type": "u64"
			},
			{
			  "name": "virtual_token_reserves",
			  "type": "u64"
			},
			{
			  "name": "real_sol_reserves",
			  "type": "u64"
			},
			{
			  "name": "real_token_reserves",
			  "type": "u64"
			}
		  ]
		}
	  }
	]
  }
  /**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/curve_launchpad.json`.
 */
/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/curve_launchpad.json`.
 */
export type CurveLaunchpad = {
	"address": "65YAWs68bmR2RpQrs2zyRNTum2NRrdWzUfUTew9kydN9",
	"metadata": {
	  "name": "curveLaunchpad",
	  "version": "0.1.0",
	  "spec": "0.1.0",
	  "description": "Created with Anchor"
	},
	"instructions": [
	  {
		"name": "bribeMetadata",
		"discriminator": [
		  104,
		  12,
		  2,
		  9,
		  237,
		  241,
		  40,
		  212
		],
		"accounts": [
		  {
			"name": "authority",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "tokenProgram2022"
		  },
		  {
			"name": "mintAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					109,
					105,
					110,
					116,
					45,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "hydra",
			"writable": true
		  },
		  {
			"name": "claimer",
			"writable": true
		  },
		  {
			"name": "bribe",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					114,
					105,
					98,
					101
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": [
		  {
			"name": "uri",
			"type": "string"
		  },
		  {
			"name": "amount",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "buy",
		"discriminator": [
		  102,
		  6,
		  61,
		  18,
		  1,
		  218,
		  235,
		  234
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "bondingCurve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "bondingCurveTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "bondingCurve"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "userTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "tokenProgram"
		  },
		  {
			"name": "sysvarRecentSlothashes",
			"address": "SysvarRecentB1ockHashes11111111111111111111"
		  },
		  {
			"name": "hydra",
			"writable": true
		  },
		  {
			"name": "eventAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "tokenAmount",
			"type": "u64"
		  },
		  {
			"name": "maxSolCost",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "buy2",
		"discriminator": [
		  4,
		  176,
		  214,
		  132,
		  174,
		  243,
		  158,
		  188
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "bondingCurve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "userTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "tokenProgram"
		  },
		  {
			"name": "eventAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "lpTokenAmount",
			"type": "u64"
		  },
		  {
			"name": "lamports",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "create",
		"discriminator": [
		  24,
		  30,
		  200,
		  40,
		  5,
		  28,
		  7,
		  119
		],
		"accounts": [
		  {
			"name": "mint",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "creator",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "mintAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					109,
					105,
					110,
					116,
					45,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "bondingCurve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "bondingCurveTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "bondingCurve"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram2022"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "associatedTokenProgram",
			"address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
		  },
		  {
			"name": "rent",
			"address": "SysvarRent111111111111111111111111111111111"
		  },
		  {
			"name": "tokenProgram2022"
		  },
		  {
			"name": "eventAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "name",
			"type": "string"
		  },
		  {
			"name": "symbol",
			"type": "string"
		  },
		  {
			"name": "uri",
			"type": "string"
		  }
		]
	  },
	  {
		"name": "initialize",
		"discriminator": [
		  175,
		  175,
		  109,
		  31,
		  13,
		  152,
		  155,
		  237
		],
		"accounts": [
		  {
			"name": "authority",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": []
	  },
	  {
		"name": "migrate",
		"discriminator": [
		  155,
		  234,
		  231,
		  146,
		  236,
		  158,
		  162,
		  30
		],
		"accounts": [
		  {
			"name": "creator",
			"docs": [
			  "Address paying to create the pool. Can be anyone"
			],
			"writable": true,
			"signer": true
		  },
		  {
			"name": "ammConfig"
		  },
		  {
			"name": "authority"
		  },
		  {
			"name": "poolState",
			"writable": true
		  },
		  {
			"name": "wsolMint",
			"docs": [
			  "WSOL mint"
			],
			"address": "So11111111111111111111111111111111111111112"
		  },
		  {
			"name": "tokenMint",
			"docs": [
			  "Token mint, the key must grater then token_0 mint."
			]
		  },
		  {
			"name": "lpMint",
			"writable": true
		  },
		  {
			"name": "creatorWsolAccount",
			"docs": [
			  "payer token0 account"
			],
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "creator"
				},
				{
				  "kind": "const",
				  "value": [
					6,
					221,
					246,
					225,
					215,
					101,
					161,
					147,
					217,
					203,
					225,
					70,
					206,
					235,
					121,
					172,
					28,
					180,
					133,
					237,
					95,
					91,
					55,
					145,
					58,
					140,
					245,
					133,
					126,
					255,
					0,
					169
				  ]
				},
				{
				  "kind": "account",
				  "path": "wsolMint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "creatorTokenAccount",
			"docs": [
			  "creator token1 account"
			],
			"writable": true
		  },
		  {
			"name": "creatorLpToken",
			"writable": true
		  },
		  {
			"name": "token0Vault",
			"writable": true
		  },
		  {
			"name": "token1Vault",
			"writable": true
		  },
		  {
			"name": "observationState",
			"writable": true
		  },
		  {
			"name": "cpSwapProgram"
		  },
		  {
			"name": "tokenProgram",
			"docs": [
			  "Program to create mint account and mint tokens"
			]
		  },
		  {
			"name": "tokenProgram2022",
			"docs": [
			  "Program to create mint account and mint tokens"
			]
		  },
		  {
			"name": "associatedTokenProgram",
			"docs": [
			  "Program to create an ATA for receiving position NFT"
			],
			"address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
		  },
		  {
			"name": "systemProgram",
			"docs": [
			  "To create a new program account"
			],
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "rent",
			"docs": [
			  "Sysvar for program account"
			],
			"address": "SysvarRent111111111111111111111111111111111"
		  },
		  {
			"name": "tokenMetadataProgram"
		  },
		  {
			"name": "metadata",
			"docs": [
			  "Token metadata program"
			],
			"writable": true
		  },
		  {
			"name": "createPoolFee",
			"writable": true
		  },
		  {
			"name": "hydra",
			"writable": true
		  },
		  {
			"name": "global",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  }
		],
		"args": [
		  {
			"name": "raydium",
			"type": "bool"
		  },
		  {
			"name": "initAmount1",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "processBurnTimeLock",
		"discriminator": [
		  88,
		  166,
		  4,
		  8,
		  194,
		  137,
		  82,
		  173
		],
		"accounts": [
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "tokenAccount",
			"writable": true
		  },
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "tokenProgram",
			"address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
		  },
		  {
			"name": "tokenProgram2022",
			"address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
		  },
		  {
			"name": "poolState"
		  },
		  {
			"name": "token0Vault",
			"writable": true
		  },
		  {
			"name": "token1Vault",
			"writable": true
		  },
		  {
			"name": "feeTier",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					102,
					101,
					101,
					95,
					116,
					105,
					101,
					114
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				},
				{
				  "kind": "arg",
				  "path": "tier"
				}
			  ]
			}
		  },
		  {
			"name": "timeLockToken",
			"writable": true
		  },
		  {
			"name": "timeLockTokenAccount",
			"writable": true
		  }
		],
		"args": [
		  {
			"name": "tier",
			"type": {
			  "defined": {
				"name": "marketCapTier"
			  }
			}
		  },
		  {
			"name": "amount",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "processInitTimeLocks",
		"discriminator": [
		  13,
		  82,
		  225,
		  110,
		  118,
		  248,
		  243,
		  190
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "tokenProgram",
			"address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "feeTier",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					102,
					101,
					101,
					95,
					116,
					105,
					101,
					114
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				},
				{
				  "kind": "arg",
				  "path": "tier"
				}
			  ]
			}
		  }
		],
		"args": [
		  {
			"name": "tier",
			"type": {
			  "defined": {
				"name": "marketCapTier"
			  }
			}
		  }
		]
	  },
	  {
		"name": "processInitializeTimeLock",
		"discriminator": [
		  75,
		  217,
		  157,
		  70,
		  176,
		  104,
		  183,
		  255
		],
		"accounts": [
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "tokenProgram",
			"address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
		  },
		  {
			"name": "tokenVault",
			"writable": true
		  },
		  {
			"name": "tokenAccount",
			"writable": true
		  },
		  {
			"name": "feeTier",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					102,
					101,
					101,
					95,
					116,
					105,
					101,
					114
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				},
				{
				  "kind": "arg",
				  "path": "tier"
				}
			  ]
			}
		  },
		  {
			"name": "timeLockToken",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "timeLockTokenAccount",
			"writable": true,
			"signer": true
		  }
		],
		"args": [
		  {
			"name": "tier",
			"type": {
			  "defined": {
				"name": "marketCapTier"
			  }
			}
		  },
		  {
			"name": "amount",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "renounceAuthority",
		"discriminator": [
		  78,
		  110,
		  117,
		  127,
		  89,
		  23,
		  253,
		  153
		],
		"accounts": [
		  {
			"name": "authority",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "tokenProgram2022"
		  },
		  {
			"name": "mintAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					109,
					105,
					110,
					116,
					45,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  }
		],
		"args": []
	  },
	  {
		"name": "sell",
		"discriminator": [
		  51,
		  230,
		  133,
		  164,
		  1,
		  127,
		  131,
		  173
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "bondingCurve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "bondingCurveTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "bondingCurve"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "userTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "tokenProgram"
		  },
		  {
			"name": "hydra",
			"writable": true
		  },
		  {
			"name": "eventAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "tokenAmount",
			"type": "u64"
		  },
		  {
			"name": "minSolOutput",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "sell2",
		"discriminator": [
		  53,
		  138,
		  160,
		  216,
		  205,
		  51,
		  57,
		  120
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "bondingCurve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "userTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "tokenProgram"
		  },
		  {
			"name": "eventAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "lpTokenAmount",
			"type": "u64"
		  },
		  {
			"name": "sellResult",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "setParams",
		"discriminator": [
		  27,
		  234,
		  178,
		  52,
		  147,
		  2,
		  187,
		  141
		],
		"accounts": [
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "user",
			"signer": true
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "eventAuthority",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					95,
					95,
					101,
					118,
					101,
					110,
					116,
					95,
					97,
					117,
					116,
					104,
					111,
					114,
					105,
					116,
					121
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "program"
		  }
		],
		"args": [
		  {
			"name": "feeRecipient",
			"type": "pubkey"
		  },
		  {
			"name": "withdrawAuthority",
			"type": "pubkey"
		  },
		  {
			"name": "initialVirtualTokenReserves",
			"type": "u64"
		  },
		  {
			"name": "initialVirtualSolReserves",
			"type": "u64"
		  },
		  {
			"name": "initialRealTokenReserves",
			"type": "u64"
		  },
		  {
			"name": "initalTokenSupply",
			"type": "u64"
		  },
		  {
			"name": "feeBasisPoints",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "withdraw",
		"discriminator": [
		  183,
		  18,
		  70,
		  156,
		  148,
		  109,
		  161,
		  34
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "global",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					103,
					108,
					111,
					98,
					97,
					108
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "mint",
			"writable": true
		  },
		  {
			"name": "lastWithdraw",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					108,
					97,
					115,
					116,
					45,
					119,
					105,
					116,
					104,
					100,
					114,
					97,
					119
				  ]
				}
			  ]
			}
		  },
		  {
			"name": "bondingCurve",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					98,
					111,
					110,
					100,
					105,
					110,
					103,
					45,
					99,
					117,
					114,
					118,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ]
			}
		  },
		  {
			"name": "bondingCurveTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "bondingCurve"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "userTokenAccount",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "tokenProgram"
				},
				{
				  "kind": "account",
				  "path": "mint"
				}
			  ],
			  "program": {
				"kind": "const",
				"value": [
				  140,
				  151,
				  37,
				  143,
				  78,
				  36,
				  137,
				  241,
				  187,
				  61,
				  16,
				  41,
				  20,
				  142,
				  13,
				  131,
				  11,
				  90,
				  19,
				  153,
				  218,
				  255,
				  16,
				  132,
				  4,
				  142,
				  123,
				  216,
				  219,
				  233,
				  248,
				  89
				]
			  }
			}
		  },
		  {
			"name": "associatedTokenProgram",
			"address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  },
		  {
			"name": "tokenProgram"
		  }
		],
		"args": []
	  }
	],
	"accounts": [
	  {
		"name": "bondingCurve",
		"discriminator": [
		  23,
		  183,
		  248,
		  55,
		  96,
		  216,
		  172,
		  96
		]
	  },
	  {
		"name": "bribe",
		"discriminator": [
		  123,
		  25,
		  44,
		  23,
		  111,
		  217,
		  65,
		  73
		]
	  },
	  {
		"name": "feeTier",
		"discriminator": [
		  56,
		  75,
		  159,
		  76,
		  142,
		  68,
		  190,
		  105
		]
	  },
	  {
		"name": "global",
		"discriminator": [
		  167,
		  232,
		  232,
		  177,
		  200,
		  108,
		  114,
		  127
		]
	  },
	  {
		"name": "lastWithdraw",
		"discriminator": [
		  203,
		  18,
		  220,
		  103,
		  120,
		  145,
		  187,
		  2
		]
	  },
	  {
		"name": "poolState",
		"discriminator": [
		  247,
		  237,
		  227,
		  245,
		  215,
		  195,
		  222,
		  70
		]
	  }
	],
	"events": [
	  {
		"name": "completeEvent",
		"discriminator": [
		  95,
		  114,
		  97,
		  156,
		  212,
		  46,
		  152,
		  8
		]
	  },
	  {
		"name": "createEvent",
		"discriminator": [
		  27,
		  114,
		  169,
		  77,
		  222,
		  235,
		  99,
		  118
		]
	  },
	  {
		"name": "setParamsEvent",
		"discriminator": [
		  223,
		  195,
		  159,
		  246,
		  62,
		  48,
		  143,
		  131
		]
	  },
	  {
		"name": "tradeEvent",
		"discriminator": [
		  189,
		  219,
		  127,
		  211,
		  78,
		  230,
		  97,
		  238
		]
	  }
	],
	"errors": [
	  {
		"code": 6000,
		"name": "alreadyInitialized",
		"msg": "Global Already Initialized"
	  },
	  {
		"code": 6001,
		"name": "notInitialized",
		"msg": "Global Not Initialized"
	  },
	  {
		"code": 6002,
		"name": "invalidAuthority",
		"msg": "Invalid Authority"
	  },
	  {
		"code": 6003,
		"name": "bondingCurveComplete",
		"msg": "Bonding Curve Complete"
	  },
	  {
		"code": 6004,
		"name": "bondingCurveNotComplete",
		"msg": "Bonding Curve Not Complete"
	  },
	  {
		"code": 6005,
		"name": "insufficientTokens",
		"msg": "Insufficient Tokens"
	  },
	  {
		"code": 6006,
		"name": "insufficientSol",
		"msg": "Insufficient SOL"
	  },
	  {
		"code": 6007,
		"name": "maxSolCostExceeded",
		"msg": "Max SOL Cost Exceeded"
	  },
	  {
		"code": 6008,
		"name": "minSolOutputExceeded",
		"msg": "Min SOL Output Exceeded"
	  },
	  {
		"code": 6009,
		"name": "minBuy",
		"msg": "Min buy is 1 Token"
	  },
	  {
		"code": 6010,
		"name": "minSell",
		"msg": "Min sell is 1 Token"
	  },
	  {
		"code": 6011,
		"name": "invalidFeeRecipient",
		"msg": "Invalid Fee Recipient"
	  },
	  {
		"code": 6012,
		"name": "invalidWithdrawAuthority",
		"msg": "Invalid Withdraw Authority"
	  },
	  {
		"code": 6013,
		"name": "bribeNotExpired",
		"msg": "Bribe Not Expired"
	  },
	  {
		"code": 6014,
		"name": "notLastBriber",
		"msg": "Not Last Briber"
	  },
	  {
		"code": 6015,
		"name": "bribeOverflow",
		"msg": "Bribe Overflow"
	  },
	  {
		"code": 6016,
		"name": "multipleBuy2Instructions",
		"msg": "Multiple Buy2 Instructions"
	  },
	  {
		"code": 6017,
		"name": "invalidBuy2Instruction",
		"msg": "Invalid Buy2 Instruction"
	  },
	  {
		"code": 6018,
		"name": "noBuy2InstructionFound",
		"msg": "No Buy2 Instruction Found"
	  },
	  {
		"code": 6019,
		"name": "multipleBuyInstructions",
		"msg": "Multiple Buy Instructions"
	  },
	  {
		"code": 6020,
		"name": "invalidBuy2",
		"msg": "Invalid Buy Instruction"
	  }
	],
	"types": [
	  {
		"name": "amm",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "virtualSolReserves",
			  "type": "u128"
			},
			{
			  "name": "virtualTokenReserves",
			  "type": "u128"
			},
			{
			  "name": "realSolReserves",
			  "type": "u128"
			},
			{
			  "name": "realTokenReserves",
			  "type": "u128"
			},
			{
			  "name": "initialVirtualTokenReserves",
			  "type": "u128"
			}
		  ]
		}
	  },
	  {
		"name": "bondingCurve",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "virtualSolReserves",
			  "type": "u64"
			},
			{
			  "name": "virtualTokenReserves",
			  "type": "u64"
			},
			{
			  "name": "realSolReserves",
			  "type": "u64"
			},
			{
			  "name": "realTokenReserves",
			  "type": "u64"
			},
			{
			  "name": "tokenTotalSupply",
			  "type": "u64"
			},
			{
			  "name": "complete",
			  "type": "bool"
			}
		  ]
		}
	  },
	  {
		"name": "bribe",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "amount",
			  "type": "u64"
			},
			{
			  "name": "lastBriber",
			  "type": "pubkey"
			},
			{
			  "name": "pot",
			  "type": "u64"
			},
			{
			  "name": "timerStart",
			  "type": "i64"
			},
			{
			  "name": "timerEnd",
			  "type": "i64"
			}
		  ]
		}
	  },
	  {
		"name": "completeEvent",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "user",
			  "type": "pubkey"
			},
			{
			  "name": "mint",
			  "type": "pubkey"
			},
			{
			  "name": "bondingCurve",
			  "type": "pubkey"
			},
			{
			  "name": "timestamp",
			  "type": "i64"
			}
		  ]
		}
	  },
	  {
		"name": "createEvent",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "name",
			  "type": "string"
			},
			{
			  "name": "symbol",
			  "type": "string"
			},
			{
			  "name": "uri",
			  "type": "string"
			},
			{
			  "name": "mint",
			  "type": "pubkey"
			},
			{
			  "name": "bondingCurve",
			  "type": "pubkey"
			},
			{
			  "name": "creator",
			  "type": "pubkey"
			}
		  ]
		}
	  },
	  {
		"name": "feeTier",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "tier",
			  "type": {
				"defined": {
				  "name": "marketCapTier"
				}
			  }
			},
			{
			  "name": "mint",
			  "type": "pubkey"
			}
		  ]
		}
	  },
	  {
		"name": "global",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "authority",
			  "type": "pubkey"
			},
			{
			  "name": "initialized",
			  "type": "bool"
			},
			{
			  "name": "feeRecipient",
			  "type": "pubkey"
			},
			{
			  "name": "initialVirtualTokenReserves",
			  "type": "u64"
			},
			{
			  "name": "initialVirtualSolReserves",
			  "type": "u64"
			},
			{
			  "name": "initialRealTokenReserves",
			  "type": "u64"
			},
			{
			  "name": "initialRealSolReserves",
			  "type": "u64"
			},
			{
			  "name": "initialTokenSupply",
			  "type": "u64"
			},
			{
			  "name": "feeBasisPoints",
			  "type": "u64"
			},
			{
			  "name": "withdrawAuthority",
			  "type": "pubkey"
			}
		  ]
		}
	  },
	  {
		"name": "lastWithdraw",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "lastWithdrawTimestamp",
			  "type": "i64"
			}
		  ]
		}
	  },
	  {
		"name": "marketCapTier",
		"type": {
		  "kind": "enum",
		  "variants": [
			{
			  "name": "oneMillion"
			},
			{
			  "name": "twoMillion"
			},
			{
			  "name": "fourMillion"
			},
			{
			  "name": "eightMillion"
			},
			{
			  "name": "sixteenMillion"
			}
		  ]
		}
	  },
	  {
		"name": "poolState",
		"serialization": "bytemuckunsafe",
		"repr": {
		  "kind": "rust",
		  "packed": true
		},
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "ammConfig",
			  "docs": [
				"Which config the pool belongs"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "poolCreator",
			  "docs": [
				"pool creator"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token0Vault",
			  "docs": [
				"Token A"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token1Vault",
			  "docs": [
				"Token B"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "lpMint",
			  "docs": [
				"Pool tokens are issued when A or B tokens are deposited.",
				"Pool tokens can be withdrawn back to the original A or B token."
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token0Mint",
			  "docs": [
				"Mint information for token A"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token1Mint",
			  "docs": [
				"Mint information for token B"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token0Program",
			  "docs": [
				"token_0 program"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token1Program",
			  "docs": [
				"token_1 program"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "observationKey",
			  "docs": [
				"observation account to store oracle data"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "authBump",
			  "type": "u8"
			},
			{
			  "name": "status",
			  "docs": [
				"Bitwise representation of the state of the pool",
				"bit0, 1: disable deposit(vaule is 1), 0: normal",
				"bit1, 1: disable withdraw(vaule is 2), 0: normal",
				"bit2, 1: disable swap(vaule is 4), 0: normal"
			  ],
			  "type": "u8"
			},
			{
			  "name": "lpMintDecimals",
			  "type": "u8"
			},
			{
			  "name": "mint0Decimals",
			  "docs": [
				"mint0 and mint1 decimals"
			  ],
			  "type": "u8"
			},
			{
			  "name": "mint1Decimals",
			  "type": "u8"
			},
			{
			  "name": "lpSupply",
			  "docs": [
				"True circulating supply without burns and lock ups"
			  ],
			  "type": "u64"
			},
			{
			  "name": "protocolFeesToken0",
			  "docs": [
				"The amounts of token_0 and token_1 that are owed to the liquidity provider."
			  ],
			  "type": "u64"
			},
			{
			  "name": "protocolFeesToken1",
			  "type": "u64"
			},
			{
			  "name": "fundFeesToken0",
			  "type": "u64"
			},
			{
			  "name": "fundFeesToken1",
			  "type": "u64"
			},
			{
			  "name": "openTime",
			  "docs": [
				"The timestamp allowed for swap in the pool."
			  ],
			  "type": "u64"
			},
			{
			  "name": "recentEpoch",
			  "docs": [
				"recent epoch"
			  ],
			  "type": "u64"
			},
			{
			  "name": "amm",
			  "type": {
				"defined": {
				  "name": "amm"
				}
			  }
			},
			{
			  "name": "safuLpSupply",
			  "type": "u64"
			},
			{
			  "name": "token0VaultSafu",
			  "docs": [
				"padding for future updates"
			  ],
			  "type": "pubkey"
			},
			{
			  "name": "token1VaultSafu",
			  "type": "pubkey"
			},
			{
			  "name": "padding",
			  "type": {
				"array": [
				  "u64",
				  22
				]
			  }
			}
		  ]
		}
	  },
	  {
		"name": "setParamsEvent",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "feeRecipient",
			  "type": "pubkey"
			},
			{
			  "name": "withdrawAuthority",
			  "type": "pubkey"
			},
			{
			  "name": "initialVirtualTokenReserves",
			  "type": "u64"
			},
			{
			  "name": "initialVirtualSolReserves",
			  "type": "u64"
			},
			{
			  "name": "initialRealTokenReserves",
			  "type": "u64"
			},
			{
			  "name": "initialTokenSupply",
			  "type": "u64"
			},
			{
			  "name": "feeBasisPoints",
			  "type": "u64"
			}
		  ]
		}
	  },
	  {
		"name": "tradeEvent",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "mint",
			  "type": "pubkey"
			},
			{
			  "name": "solAmount",
			  "type": "u64"
			},
			{
			  "name": "tokenAmount",
			  "type": "u64"
			},
			{
			  "name": "isBuy",
			  "type": "bool"
			},
			{
			  "name": "user",
			  "type": "pubkey"
			},
			{
			  "name": "timestamp",
			  "type": "i64"
			},
			{
			  "name": "virtualSolReserves",
			  "type": "u64"
			},
			{
			  "name": "virtualTokenReserves",
			  "type": "u64"
			},
			{
			  "name": "realSolReserves",
			  "type": "u64"
			},
			{
			  "name": "realTokenReserves",
			  "type": "u64"
			}
		  ]
		}
	  }
	]
  };
	
async function shortenUri(url: string): Promise<string> {
	try {
	  const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)
	  return await response.text()
	} catch (error) {
	  console.error('Error shortening URL:', error)
	  return url.substring(0, 200)
	}
  }
function IconDropZone({ onFileChange }: { onFileChange: (file: File) => void }) {
	const [iconFile, setIconFile] = useState<File | null>(null);
	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".webp"],
		},
		onDrop: (acceptedFiles: File[]) => {
			setIconFile(acceptedFiles[0]);
			onFileChange(acceptedFiles[0]);
		},
	});

	return (
		<div className="col-span-full md:col-span-1 aspect-video md:aspect-square flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<p className="text-xl">Icon</p>
				{iconFile && (
					<div
						className="flex items-center gap-2 text-sm text-white/50 cursor-pointer hover:text-white/100 transition-all duration-300"
						onClick={() => {
							setIconFile(null);
						}}
					>
						<Icon icon="fa6-solid:trash" className="w-2" />
						<p className="leading-none pt-0.5">Clear</p>
					</div>
				)}
			</div>
			<div
				{...getRootProps()}
				className="bg-[#27272a] rounded-lg p-4 flex flex-col items-center justify-center aspect-video md:aspect-square"
				style={{
					backgroundImage: `url(${iconFile ? URL.createObjectURL(iconFile) : ""})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<input {...getInputProps()} />
				{!iconFile && (
					<div className="flex items-center justify-center">
						<Icon icon="fa6-solid:image" className="w-10" />
						<p>upload</p>
					</div>
				)}
			</div>
		</div>
	);
}

function BannerDropZone({ onFileChange }: { onFileChange: (file: File) => void }) {
	const [bannerFile, setBannerFile] = useState<File | null>(null);
	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".webp"],
		},
		onDrop: (acceptedFiles: File[]) => {
			setBannerFile(acceptedFiles[0]);
			onFileChange(acceptedFiles[0]);
		},
	});

	return (
		<div className="col-span-3 flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<p className="text-xl">Banner</p>
				{bannerFile && (
					<div
						className="flex items-center gap-2 text-sm text-white/50 cursor-pointer hover:text-white/100 transition-all duration-300"
						onClick={() => {
							setBannerFile(null);
						}}
					>
						<Icon icon="fa6-solid:trash" className="w-2" />
						<p className="leading-none pt-0.5">Clear</p>
					</div>
				)}
			</div>
			<div
				{...getRootProps()}
				className="bg-[#27272a] rounded-lg p-4 flex flex-col items-center justify-center flex-1 aspect-video md:aspect-auto"
				style={{
					backgroundImage: `url(${bannerFile ? URL.createObjectURL(bannerFile) : ""})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<input {...getInputProps()} />
				{!bannerFile && (
					<div className="flex items-center justify-center">
						<Icon icon="fa6-solid:image" className="w-10" />
						<p>upload</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default function LaunchPage() {
	const { Field, handleSubmit, state, setFieldValue, Subscribe } = useForm({
		defaultValues: {
			dex: "GOBBLER",
			tokenSymbol: "",
			tokenName: "",
			description: "",
			website: "",
			twitter: "",
			telegram: "",
			discord: "",
			otherLink: "",
			initialBuy: "",
			agreeTerms: false,
			icon: null,
			banner: null,
		},
		onSubmit: (values) => {
			console.log("Form submitted:", values);
			setIsLoading(true);

			if (values.value.dex === "GOBBLER") {
				try {
					// @ts-ignore
					 createGobblerPools(values.value);
					console.log("Gobbler pools created successfully");
				} catch (error) {
					console.error("Error creating Gobbler pools:", error);
				}
			} else if (values.value.dex === "fomo3d") {
				try {
					 handleCreate(values.value);
					console.log("Fomo3D token created successfully");
				} catch (error) {
					console.error("Error creating Fomo3D token:", error);
				}
			}

			setIsLoading(false);
		},
	});

	const [programs, setPrograms] = useState<{ [key: string]: Program<any> }>({})
	const [poolExists, setPoolExists] = useState(false)
	const [tokenName, setTokenName] = useState("")
	const [tokenSymbol, setTokenSymbol] = useState("")
	const [tokenDescription, setTokenDescription] = useState("")
	const [tokenImage, setTokenImage] = useState<File | null>(null)
	const jupiterApi = createJupiterApiClient({ basePath: "https://superswap.fomo3d.fun" })
  
	const wallet = useWallet()
	const [isLoading, setIsLoading] = useState(false)
	const [tokens, setTokens] = useState<TokenInfo[]>([])
	const [allTokens, setAllTokens] = useState<TokenInfo[]>([]);
	const [formValue, setFormValue] = useState({
	  amount: "1",
	  inputMint: "",
	  outputMint: "",
	  slippage: 0.5,
	})
	const [quoteResponse, setQuoteResponse] = useState<any>(null)
	const [searchInput, setSearchInput] = useState("")
	const [searchOutput, setSearchOutput] = useState("")
  const [inputToken, setInputToken] = useState<TokenInfo | null>(null);
  const [outputToken, setOutputToken] = useState<TokenInfo | null>(null);
  
	const endpoint = "https://rpc.ironforge.network/mainnet?apiKey=01HRZ9G6Z2A19FY8PR4RF4J4PW"
	const connection = new Connection(endpoint)
  
	useEffect(() => {
	  const fetchTokens = async () => {
		if (!wallet.publicKey) return;
  
		try {
		  // Fetch the user's token balances
		  let userTokens: TokenInfo[] = [];
		  let page = 1;
		  const limit = 100;
		  let hasMore = true;
  
		  while (hasMore) {
			const response = await fetch('https://mainnet.helius-rpc.com/?api-key=0d4b4fd6-c2fc-4f55-b615-a23bab1ffc85', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({
				jsonrpc: '2.0',
				id: `page-${page}`,
				method: 'getAssetsByOwner',
				params: {
				  ownerAddress: wallet.publicKey.toBase58(),
				  page: page,
				  limit: limit,
				  displayOptions: {
					showFungible: true
				  }
				},
			  }),
			});
  
			const { result } = await response.json();
			
			if (result.items.length === 0) {
			  hasMore = false;
			} else {
			  const pageTokens = result.items
				.filter((item: any) => item.interface === 'FungibleToken' || item.interface === 'FungibleAsset')
				.map((token: any) => {
				  return {
					address: token.id,
					balance: token.token_info?.balance || '0',
					symbol: token.symbol || token.content?.metadata?.symbol || '',
					name: token.content?.metadata?.name || '',
					decimals: token.token_info?.decimals || 0,
					logoURI: token.content?.links?.image || '',
				  };
				});
  
			  userTokens = [...userTokens, ...pageTokens];
			  
			  if (page === 1 && pageTokens.length > 1) {
				setFormValue((prev:any) => ({
				  ...prev,
				}));
			  }
			  
			  page++;
			}
		  }
  
		  setTokens(userTokens.filter(token => token !== null));
  
		  // Fetch the top tokens for the output token list
		  const response = await fetch('https://superswap.fomo3d.fun/mints')
		  const data = await response.json();
		  let mints = data.mints;
		  // Fetch the top tokens list
		
		  // If there are no filtered mints, use the original mints array
		  setAllTokens(mints);
		  if (userTokens.length > 1) {
			setFormValue((prev:any)=> ({
			  ...prev,
			}));
		  }
		} catch (error) {
		  console.error("Failed to fetch tokens:", error);
		}
	  };
	  fetchTokens()
	}, [wallet.publicKey])

	const [success,setSuccess] = useState("")
	const fetchQuote = useCallback(async (inputMint: string, outputMint: string, amount: number) => {
	  if (!inputMint || !outputMint || !amount) return null;
	  try {
		const quote = await jupiterApi.quoteGet({
		  inputMint: inputMint,
		  outputMint: outputMint,
		  amount: amount,
		  slippageBps: 100, // 1% slippage
		});
		return quote;
	  } catch (error) {
		console.error("Failed to fetch quote:", error);
		return null;
	  }
	}, []);
  
  
	const handleSwap = async () => {
	  if (!quoteResponse || !wallet.publicKey || !wallet.signTransaction) return
  
	  try {
		const swapResult = await jupiterApi.swapPost({
		  swapRequest: {
		  userPublicKey: wallet.publicKey.toBase58(),
		  quoteResponse},
		})
		console.log("Swap transaction created:", swapResult)
		// Deserialize the transaction
		const swapTransactionBuf = Buffer.from(swapResult.swapTransaction, 'base64');
		const transaction = await wallet.signTransaction(VersionedTransaction.deserialize(Uint8Array.from(swapTransactionBuf)));
		
		// Get the latest blockhash
		const latestBlockhash = await connection.getLatestBlockhash();
		
		// Execute the transaction
		const rawTransaction = transaction.serialize()
		const txid = await connection.sendRawTransaction(rawTransaction, {
		  skipPreflight: true,
		  maxRetries: 2
		});
		
		console.log(`Swap transaction successful: https://solscan.io/tx/${txid}`);
		setSuccess(`Swap transaction successful: https://solscan.io/tx/${txid}`);
	  } catch (error) {
		setError(`Swap failed: ${error instanceof Error ? error.message : String(error)}`);
		console.error("Swap failed:", error)
	  }
	}

const [error, setError] = useState<string | null>(null);

	const umi = wallet.publicKey
    ? createUmi(connection.rpcEndpoint)
        .use(irysUploader())
        .use(mplToolbox())
        .use(walletAdapterIdentity(wallet as any))
    : null

	useEffect(() => {
		const fetchRandomTokens = async () => {
			try {
				const response = await fetch('https://superswap.fomo3d.fun/mints');
				const data = await response.json();
				let mints = data.mints;
			
				// Filter mints to only include those from the top tokens list
				const filteredMints = mints	

				// If there are no filtered mints, use the original mints array
				 mints = filteredMints.length > 0 ? filteredMints : mints;

				// Function to get a valid quote
				const getValidQuote = async (fromMint: string, toMint: string, amount: number) => {
					try {
						const quote = await fetchQuote(fromMint, toMint, amount);
						console.log(quote?.outAmount)
						if (Number(quote?.outAmount) > amount/2) return quote 
						return null
					} catch (error) {
						console.warn(`Failed to get quote for ${fromMint} to ${toMint}.`);
						return null;
					}
				};

				// Function to select a random token pair with valid quotes
				const selectRandomTokenPair = async () => {
					const solAmount = 1000000000; // 1 SOL in lamports
					const solMint = 'So11111111111111111111111111111111111111112';

					while (true) {
						const tokenA = mints[Math.floor(Math.random() * mints.length)];
						let tokenB;
						do {
							tokenB = mints[Math.floor(Math.random() * mints.length)];
						} while (tokenB.address === tokenA.address);

						const quoteA = await getValidQuote(solMint, tokenA.address, solAmount);
						const quoteB = await getValidQuote(solMint, tokenB.address, solAmount);

						if (quoteA && quoteB) {
							return [tokenA, tokenB];
						}
					}
				};

				// Select new tokens only if they're not already set
				if (!inputToken || !outputToken) {
					const [newTokenA, newTokenB] = await selectRandomTokenPair();

					setInputToken(newTokenA);
					setOutputToken(newTokenB);
					setFormValue((prevState: any) => ({
						...prevState,
						inputMint: newTokenA.address,
						outputMint: newTokenB.address,
					}));

					console.log('Selected token addresses:', newTokenA.address, newTokenB.address);
					console.log('Updated input token:', newTokenA);
					console.log('Updated output token:', newTokenB);
					const randomTokenA = newTokenA
					const randomTokenB = newTokenB
				console.log('Selected token addresses:', randomTokenA.address, randomTokenB.address);

				formValue.inputMint =randomTokenA.address
				formValue.outputMint = randomTokenB.address;
				}

			} catch (error) {
				console.error('Error fetching random tokens:', error);
			}
		};

		fetchRandomTokens();
	}, []);
	const aw = useAnchorWallet()
	const [isCreating, setIsCreating] = useState(false);
	const handleCreate = useCallback(async (values: any) => {
		// Set values from the form
		setTokenName(values.tokenName);
		setTokenSymbol(values.tokenSymbol);
		setTokenDescription(values.description);
		setTokenImage(values.icon);

		// Update formValue state
		setFormValue((prevState:any) => ({
			...prevState,
			inputMint: 'So11111111111111111111111111111111111111112', // SOL mint address
			outputMint: '', // This will be set to the newly created token's address later
			amount: values.initialBuy || '1', // Use initialBuy if provided, otherwise default to '1'
		}));

		// Additional form values that might be useful
		const website = values.website;
		const twitter = values.twitter;
		const telegram = values.telegram;
		const discord = values.discord;
		const otherLink = values.otherLink;

		console.log('Form values set for token creation:', {
			tokenName,
			tokenSymbol,
			tokenDescription,
			initialBuy: formValue.amount,
			website,
			twitter,
			telegram,
			discord,
			otherLink
		});
		if (!wallet || !umi || !aw || !wallet.publicKey) {
			console.error('Missing required dependencies')
			return
		}
		// @ts-ignore
		const program2 = new Program<CurveLaunchpad>(IDL as any, new AnchorProvider(connection, aw, {})) 

			// Create AMM with default values
			const DEFAULT_VIRTUAL_SOL_RESERVES = BigInt(30000000000);
			const DEFAULT_VIRTUAL_TOKEN_RESERVES = BigInt(1073000000000000);
			const DEFAULT_REAL_SOL_RESERVES = BigInt(0);
			const DEFAULT_REAL_TOKEN_RESERVES = BigInt(793100000000000);
			const DEFAULT_INITIAL_VIRTUAL_TOKEN_RESERVES = BigInt(1073000000000000);

			const amm = new LPAMM(
				DEFAULT_VIRTUAL_SOL_RESERVES,
				DEFAULT_VIRTUAL_TOKEN_RESERVES,
				DEFAULT_REAL_SOL_RESERVES,
				DEFAULT_REAL_TOKEN_RESERVES,
				DEFAULT_INITIAL_VIRTUAL_TOKEN_RESERVES
			);

			// Get buy price for the initial buy amount
			let initialBuyAmount = BigInt(0);
			if (values.initialBuy && parseFloat(values.initialBuy) > 0) {
				initialBuyAmount = BigInt(Math.floor(parseFloat(values.initialBuy) * 10 ** 9));
			}
			const buyPrice = amm.getBuyTokensWithSol(initialBuyAmount).tokenAmount;
			console.log('Initial buy amount:', initialBuyAmount.toString());
			console.log('Buy price:', buyPrice.toString());
		setIsCreating(true)
		try {
			const mint = Keypair.generate()
			console.log('Generated mint keypair:', mint.publicKey.toBase58())

			let imageUri = ''
			if (tokenImage) {
				console.log('Uploading token image')
				const genericFile = {
					buffer: new Uint8Array(await tokenImage.arrayBuffer()),
					fileName: tokenImage.name,
					displayName: tokenImage.name,
					uniqueName: `${Date.now()}-${tokenImage.name}`,
					contentType: tokenImage.type,
					extension: tokenImage.name.split('.').pop() || '',
					tags: []
				}
				const [uploadedUri] = await umi.uploader.upload([genericFile])
				console.log('Image uploaded, URI:', uploadedUri)
				const response = await fetch(uploadedUri)
				imageUri = response.url
				console.log('Image URI:', imageUri)
			}

			const metadata = {
				name: tokenName,
				symbol: tokenSymbol,
				description: tokenDescription + ' ' + 'launched on fomo3d.fun',
				image: imageUri,
			}
			console.log('Prepared metadata:', metadata)

			console.log('Uploading metadata')
			const metadataUri = await umi.uploader.uploadJson(metadata)
			console.log('Metadata uploaded, URI:', metadataUri)
			const metadataResponse = await fetch(metadataUri)
			const tokenUri = metadataResponse.url
			console.log('Token URI:', tokenUri)

			console.log('Preparing create instruction')
			const ix = await program2.methods
				.create(tokenName, tokenSymbol, tokenUri)
				.accounts({
					mint: mint.publicKey,
					creator: wallet.publicKey,
					
					tokenProgram2022: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
					program: program2.programId,
				})
				.instruction()
			console.log('Create instruction prepared')
			const [bondingCurvePda] = PublicKey.findProgramAddressSync(
				[
					Buffer.from("bonding-curve"),
					mint.publicKey.toBuffer()
				],
				program2.programId
			);

			const [mintAuthorityPda] = PublicKey.findProgramAddressSync(
				[Buffer.from("mint-authority")],
				program2.programId
			);

			const [globalPda] = PublicKey.findProgramAddressSync(
				[Buffer.from("global")],
				program2.programId
			);

			const [eventAuthorityPda] = PublicKey.findProgramAddressSync(
				[Buffer.from("__event_authority")],
				program2.programId
			);


			console.log('Sending transaction')
			if (values.initialBuy && parseFloat(values.initialBuy) > 0) {
				const buyIx = await program2.methods
					.buy(new BN(buyPrice.toString()), new BN(Number.MAX_SAFE_INTEGER))
					.accounts({
						user: wallet.publicKey,
						mint: mint.publicKey,

						tokenProgram: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
						hydra: new PublicKey("AZHP79aixRbsjwNhNeuuVsWD4Gdv1vbYQd8nWKMGZyPZ"),
						program: program2.programId,
					})
					.instruction()
				const tx = new Transaction().add(ix)
				.add(SystemProgram.transfer({
					fromPubkey: wallet.publicKey,
					toPubkey: mint.publicKey,
					lamports:0.02 * 10 ** 9
				}))
				.add(createAssociatedTokenAccountInstruction(
					wallet.publicKey,
					getAssociatedTokenAddressSync(mint.publicKey, wallet.publicKey, true, new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")),
					wallet.publicKey,
					mint.publicKey,
					new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
				))
				.add(buyIx);
				const signature = await wallet.sendTransaction(tx, connection, {
					signers: [mint]
				});
				console.log('Transaction sent with initial buy, signature:', signature);
			console.log('Transaction sent with initial buy, signature:', signature);
			if (typeof window !== 'undefined') {
				window.location.href = `/token/${mint.publicKey.toBase58()}`;
			}
			} else {
				const tx = new Transaction().add(ix)
				const signature = await wallet.sendTransaction(tx, connection, {
					signers: [mint]
				})
				console.log('Transaction sent, signature:', signature)
			}

			setIsCreating(false)

		} catch (error) {
			console.error('Error in handleCreate:', error)
			setIsCreating(false)
		}
	}, [ wallet, umi, tokenImage, tokenName, tokenSymbol, tokenDescription, connection])

// New AMM class for LP_PROGRAM_ID with different price assessment
const DEFAULT_TOKEN_RESERVES = BigInt("210000000000000000");
const DEFAULT_VIRTUAL_SOL_RESERVE = BigInt("3000000000000");
const DEFAULT_VIRTUAL_TOKEN_RESERVE = BigInt("166551000000000000");
const DEFAULT_INITIAL_VIRTUAL_TOKEN_RESERVE = BigInt("217300000000000000");
const DEFAULT_FEE_BASIS_POINTS = BigInt("50");

class LPAMM {
  constructor(
    public virtualSolReserves: bigint,
    public virtualTokenReserves: bigint,
    public realSolReserves: bigint,
    public realTokenReserves: bigint,
    public initialVirtualTokenReserves: bigint,
  ) {}

  mintPubkey: PublicKey | null = null;

  getBuyPrice(tokens: bigint): bigint {
    if (tokens === BigInt(0) || tokens > this.virtualTokenReserves) {
      throw new Error("Invalid token amount");
    }

    const productOfReserves = this.virtualSolReserves * this.virtualTokenReserves;
    const newVirtualTokenReserves = this.virtualTokenReserves - tokens;
    const newVirtualSolReserves = productOfReserves / newVirtualTokenReserves + BigInt(1);
    return newVirtualSolReserves - this.virtualSolReserves;
  }

  getSellPrice(tokens: bigint): bigint {
    if (tokens === BigInt(0) || tokens > this.virtualTokenReserves) {
      throw new Error("Invalid token amount");
    }

    const productOfReserves = this.virtualSolReserves * this.virtualTokenReserves;
    const newVirtualTokenReserves = this.virtualTokenReserves + tokens;
    const newVirtualSolReserves = productOfReserves / newVirtualTokenReserves;
    const solAmount = this.virtualSolReserves - newVirtualSolReserves;
    return solAmount < this.realSolReserves ? solAmount : this.realSolReserves;
  }

  applyBuy(tokenAmount: bigint): { tokenAmount: bigint; solAmount: bigint } {
    const finalTokenAmount = tokenAmount < this.realTokenReserves ? tokenAmount : this.realTokenReserves;
    const solAmount = this.getBuyPrice(finalTokenAmount);

    this.virtualTokenReserves -= finalTokenAmount;
    this.realTokenReserves -= finalTokenAmount;
    this.virtualSolReserves += solAmount;
    this.realSolReserves += solAmount;

    return { tokenAmount: finalTokenAmount, solAmount };
  }

  applySell(tokenAmount: bigint): { tokenAmount: bigint; solAmount: bigint } {
    const solAmount = this.getSellPrice(tokenAmount);

    this.virtualTokenReserves += tokenAmount;
    this.realTokenReserves += tokenAmount;
    this.virtualSolReserves -= solAmount;
    this.realSolReserves -= solAmount;

    return { tokenAmount, solAmount };
  }

  getBuyTokensWithSol(solAmount: bigint): { tokenAmount: bigint; solAmount: bigint } {
    if (solAmount <= 0n) {
      return { tokenAmount: 0n, solAmount: 0n };
    }

    // Calculate the product of virtual reserves
    const n = this.virtualSolReserves * this.virtualTokenReserves;

    // Calculate the new virtual sol reserves after the purchase
    const i = this.virtualSolReserves + solAmount;

    // Calculate the new virtual token reserves after the purchase
    const r = n / i + 1n;

    // Calculate the amount of tokens to be purchased
    let s = this.virtualTokenReserves - r;

    // Ensure we don't exceed the real token reserves
    s = s < this.realTokenReserves ? s : this.realTokenReserves;

    // Ensure we're not returning zero tokens
    if (s === 0n && solAmount > 0n) {
      s = 1n;
    }

    return { tokenAmount: s, solAmount };
  }

  update(realSolReserves: bigint): void {
    this.virtualTokenReserves = DEFAULT_TOKEN_RESERVES - this.realTokenReserves;
    this.realSolReserves = realSolReserves;
    this.virtualSolReserves = DEFAULT_VIRTUAL_SOL_RESERVE + this.realSolReserves;
    this.realTokenReserves = DEFAULT_TOKEN_RESERVES - this.virtualTokenReserves;
    this.initialVirtualTokenReserves = DEFAULT_INITIAL_VIRTUAL_TOKEN_RESERVE;
  }
}
	const createGobblerPools = async ({
		tokenName,
		tokenSymbol,
		description,
		icon,
		banner,
		initialBuy,
		dex,
		agreeTerms,
		discord,
		telegram,
		twitter,
		otherLink,
		website
	}: {
		tokenName: string;
		tokenSymbol: string;
		description: string;
		icon: File;
		banner: File;
		initialBuy: string;
		dex: string;
		agreeTerms: boolean;
		discord: string;
		telegram: string;
		twitter: string;
		otherLink: string;
		website: string;
	}) => {
		console.log('Starting createGobblerPools function...');
		
		if (!wallet || !wallet.publicKey) {
			console.error('Wallet or public key is missing');
			return;
		}

		if (!inputToken || !outputToken) {
			console.error('Input or output token is missing');
			return;
		}
		console.log(description, tokenName, tokenSymbol)
		if (!tokenName || !tokenSymbol || !description) {
			console.error('Token details are incomplete');
			return;
		}
		const tokenImage = icon
		if (!tokenImage) {
			console.error('Token image is missing');
			return;
		}

		if (!umi) {
			console.error('UMI is not initialized');
			return;
		}

		// Swap into tokenA and tokenB
		console.log('Preparing to swap into tokenA and tokenB...');
		let amountA, amountB
		const swapToToken = async (targetTokenAddress: string) => {
			if (!wallet.publicKey || !wallet.signTransaction) {
				throw new Error("Wallet or quote response not available");
			}

			// Get a new quote for the swap
			const quote = await fetchQuote('So11111111111111111111111111111111111111112', targetTokenAddress, Number(initialBuy) * 10**9);
			if (!quote) {
				throw new Error("Failed to fetch quote for swap");
			}
			const quoteResponse = quote;

			try {
				const swapResult = await jupiterApi.swapPost({
					swapRequest: {
						userPublicKey: wallet.publicKey.toBase58(),
						quoteResponse
					},
				});
				console.log("Swap transaction created:", swapResult);

				const swapTransactionBuf = Buffer.from(swapResult.swapTransaction, 'base64');
				const transaction = VersionedTransaction.deserialize(Uint8Array.from(swapTransactionBuf));
				
				if (!wallet.signTransaction) {
					throw new Error("Wallet does not support signing transactions");
				}
				
				const signedTransaction = await wallet.signTransaction(transaction);
				
				const rawTransaction = signedTransaction.serialize();
				const txid = await connection.sendRawTransaction(rawTransaction, {
					skipPreflight: true,
					maxRetries: 2
				});
				
				console.log(`Swap to ${targetTokenAddress} successful: https://solscan.io/tx/${txid}`);
				setSuccess(`Swap to ${targetTokenAddress} successful: https://solscan.io/tx/${txid}`);
				return new BN(quote.outAmount);
			} catch (error) {
				setError(`Swap failed: ${error instanceof Error ? error.message : String(error)}`);
				console.error("Swap failed:", error);
				throw error;
			}
		};

		try {
			// Swap to tokenA
			amountA = await swapToToken(inputToken.address);

			// Swap to tokenB
			amountB = await swapToToken(outputToken.address);

			

			console.log('Successfully swapped into both tokenA and tokenB');
		} catch (error) {
			console.error('Error during token swaps:', error);
			// Handle the error appropriately, maybe set an error state or show a notification
		}
const amm = new LPAMM(
  BigInt(3000000000000),
  BigInt(166551000000000000),
  BigInt(210000000000000000),
  BigInt(210000000000000000),
  BigInt(217300000000000000),
);

let targetAmountA = BigInt(amountA?.toString() || '0');
let targetAmountB = BigInt(amountB?.toString() || '0');

let initAmount0 = targetAmountA;
let initAmount1 = targetAmountB;

console.log('Initial amounts:', { initAmount0: initAmount0.toString(), initAmount1: initAmount1.toString() });

// Calculate total SOL amount
let totalSolAmount = BigInt(Math.floor(Math.sqrt(Number(initAmount0) * Number(initAmount1))));

// Use getBuyTokensWithSol to get the token amount
const buyResult = amm.applyBuy(totalSolAmount);

if (!buyResult) {
    console.error("Buy result is undefined");
    throw new Error("Buy result is undefined");
}

console.log('Buy result:', { solAmount: buyResult.solAmount.toString(), tokenAmount: buyResult.tokenAmount.toString() });

// Calculate the cost ratio
let costRatio = Number(buyResult.solAmount) / Number(totalSolAmount);

// Recalculate init amounts based on the cost ratio
initAmount0 = BigInt(Math.ceil(Number(targetAmountA) * costRatio));
initAmount1 = BigInt(Math.ceil(Number(targetAmountB) * costRatio));

console.log('Cost ratio:', costRatio);
console.log('Recalculated amounts:', { initAmount0: initAmount0.toString(), initAmount1: initAmount1.toString() });

console.log('Final amounts:', { initAmount0: initAmount0.toString(), initAmount1: initAmount1.toString() });

console.log('Final init amount 0:', initAmount0.toString());
console.log('Final init amount 1:', initAmount1.toString());

// Update AMM state if necessary
// pool_state.amm = amm;
		try {
		  console.log('Creating memecoin...')
	
		  const genericFile = {
			buffer: new Uint8Array(await tokenImage.arrayBuffer()),
			fileName: tokenImage.name,
			displayName: tokenImage.name,
			uniqueName: `${Date.now()}-${tokenImage.name}`,
			contentType: tokenImage.type,
			extension: tokenImage.name.split('.').pop() || '',
			tags: []
		  }
		  const [imageUri] = await umi.uploader.upload([genericFile])
	
		  const metadata = {
			name: tokenName,
			symbol: tokenSymbol,
			description: description,
			seller_fee_basis_points: 500,
			image: imageUri,
			attributes: [],
			properties: {
			  files: [
				{
				  uri: imageUri,
				  type: tokenImage.type
				}
			  ],
			  category: 'image'
			}
		  }
	
		  if (tokenImage.type.startsWith('video/')) {
			
			metadata.properties.category = 'video'
			// @ts-ignore
			metadata.animation_url = imageUri
	
			const video = document.createElement('video')
			video.src = URL.createObjectURL(tokenImage)
			video.load()
	
			await new Promise<void>((resolve) => {
			  video.onloadeddata = () => {
				video.currentTime = 1
	
				const canvas = document.createElement('canvas')
				canvas.width = video.videoWidth
				canvas.height = video.videoHeight
	
				const ctx = canvas.getContext('2d')
				ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
	
				const snapshotImageUri = canvas.toDataURL('image/jpeg')
	
				metadata.properties.files.push({
				  uri: snapshotImageUri,
				  type: 'image/jpeg'
				})
				resolve()
			  }
			})
		  } else if (tokenImage.type.startsWith('audio/')) {
			metadata.properties.category = 'audio'
			// @ts-ignore
			metadata.animation_url = imageUri
		  }
	
		  const uri = await umi.uploader.uploadJson(metadata)
		  const tokenAMint = new PublicKey(inputToken.address)
		  const tokenBMint = new PublicKey(outputToken.address)
		  const isFront = new BN(tokenAMint.toBuffer()).lte(
		      new BN(tokenBMint.toBuffer()))
	
		  const [mintA, mintB] = isFront ? [tokenAMint, tokenBMint] : [tokenBMint, tokenAMint]
		  const aa = new BN(initAmount0.toString())
		  const ab = new BN(initAmount1.toString())
		  const [tokenAInfo, tokenBInfo] = isFront ? [inputToken, outputToken] : [outputToken, inputToken]
		  const [tokenAAmount, tokenBAmount] = isFront ? [aa, ab] : [ab, aa]
	
		  const configId = 0
		  const [ammConfigKey, _bump] = PublicKey.findProgramAddressSync(
			[Buffer.from('amm_config'), new BN(configId).toArrayLike(Buffer, 'be', 8)],
			CREATE_CPMM_POOL_PROGRAM
		  )
		  const poolKeys = getCreatePoolKeys({
			creator: wallet.publicKey,
			programId: CREATE_CPMM_POOL_PROGRAM,
			mintA,
			mintB,
			configId: ammConfigKey
		  })
		  poolKeys.configId = ammConfigKey
	
		  // Fetch account info for mintA and mintB to get their program IDs
		  const mintAAccountInfo = await connection.getAccountInfo(mintA);
		  const mintBAccountInfo = await connection.getAccountInfo(mintB);
	
		  if (!mintAAccountInfo || !mintBAccountInfo) {
			throw new Error("Failed to fetch mint account info");
		  }
	
		  // Set the program IDs based on the account owners
		  tokenAInfo.programId = mintAAccountInfo.owner.toBase58();
		  tokenBInfo.programId = mintBAccountInfo.owner.toBase58();
		  const startTimeValue = Math.floor(Date.now() / 1000)
	
		  const instructions = [
			makeCreateCpmmPoolInInstruction(
			  CREATE_CPMM_POOL_PROGRAM,
			  wallet.publicKey,
			  ammConfigKey,
			  poolKeys.authority,
			  poolKeys.poolId,
			  mintA,
			  mintB,
			  poolKeys.lpMint,
			  getAssociatedTokenAddressSync
			  (
				mintA,
				wallet.publicKey,
				true,
				(new PublicKey(tokenAInfo?.programId) || TOKEN_PROGRAM_ID )
			  ),
			  getAssociatedTokenAddressSync(
				mintB,
				wallet.publicKey,
				true,
				(new PublicKey(tokenBInfo?.programId) || TOKEN_PROGRAM_ID )
			  ),
			  getAssociatedTokenAddressSync(poolKeys.lpMint, wallet.publicKey, true, TOKEN_PROGRAM_ID),
			  poolKeys.vaultA,
			  poolKeys.vaultB,
			  (new PublicKey(tokenAInfo?.programId) || TOKEN_PROGRAM_ID ),
			  (new PublicKey(tokenBInfo?.programId) || TOKEN_PROGRAM_ID ),
			  poolKeys.observationId,
			  tokenAAmount,
			  tokenBAmount,
			  new BN(startTimeValue)
			),
			makeInitializeMetadata(
			  CREATE_CPMM_POOL_PROGRAM,
			  wallet.publicKey,
			  poolKeys.authority,
			  poolKeys.lpMint,
			  METADATA_PROGRAM_ID,
			  PublicKey.findProgramAddressSync(
				[Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), poolKeys.lpMint.toBuffer()],
				METADATA_PROGRAM_ID
			  )[0],
			  SystemProgram.programId,
			  SYSVAR_RENT_PUBKEY,
			  ammConfigKey,
			  poolKeys.poolId,
			  poolKeys.observationId,
			  tokenName,
			  tokenSymbol,
			  await shortenUri(uri)
			)
		  ]
		  instructions[1].keys.push({
			pubkey: wallet.publicKey,
			isSigner: false,
			isWritable: true
		  })
	
	
		  const tokenAAccount = await getAssociatedTokenAddressSync(mintA, wallet.publicKey, true, new PublicKey(tokenAInfo.programId) || TOKEN_PROGRAM_ID);
		  const tokenBAccount = await getAssociatedTokenAddressSync(mintB, wallet.publicKey, true, new PublicKey(tokenBInfo.programId) || TOKEN_PROGRAM_ID);
	  
		  let preInstructions = [];
	  
		  const tokenAAccountInfo = await connection.getAccountInfo(tokenAAccount);
		  if (!tokenAAccountInfo) {
			preInstructions.push(
			  createAssociatedTokenAccountInstruction(
				wallet.publicKey,
				tokenAAccount,
				wallet.publicKey,
				mintA,
				new PublicKey(tokenAInfo.programId) || TOKEN_PROGRAM_ID
			  )
			);
		  }
	  
		  const tokenBAccountInfo = await connection.getAccountInfo(tokenBAccount);
		  if (!tokenBAccountInfo) {
			preInstructions.push(
			  createAssociatedTokenAccountInstruction(
				wallet.publicKey,
				tokenBAccount,
				wallet.publicKey,
				mintB,
				new PublicKey(tokenBInfo.programId) || TOKEN_PROGRAM_ID
			  )
			);
		  }
		  const transaction = new Transaction().add(...preInstructions, ...instructions).add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 333333 }))
		  const { blockhash } = await connection.getLatestBlockhash()
		  transaction.recentBlockhash = blockhash
		  transaction.feePayer = wallet.publicKey
		  if (!wallet.signTransaction) return
		  const signedTransaction = await wallet.signTransaction(transaction)
		  const txid = await connection.sendRawTransaction(signedTransaction.serialize())
		  await connection.confirmTransaction(txid)
	
		  console.log(`Pool creation successful: https://solscan.io/tx/${txid}`)
		  setSuccess(`Pool creation successful: https://solscan.io/tx/${txid}`)
		  // Redirect to the token page
		  if (typeof window !== 'undefined') {
			window.location.href = `/token/${mintA.toBase58()}`;
		  }
		  setPoolExists(true)
		} catch (error) {
		  console.error('Error creating pool:', error)
		}
	  }
	
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				handleSubmit();
			}}
		>
			<div className="pb-10 pt-0 md:pt-6">
				<h1 className="text-3xl font-bold text-center px-4 pt-0 md:pt-4">Launch your token with FOMO3D</h1>
				<p className="text-xl text-center px-4">FOMO3D is a decentralized exchange that allows you to launch your token with ease.</p>
			</div>

			<Divider />

			<div className="w-full md:w-[800px] mx-auto pb-44 px-4 md:px-0">
				<h2 className="text-2xl font-bold text-center p-6">Choose a DEX</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
					<Field
						name="dex"
						children={({ state, handleChange, handleBlur }) => (
							<>
								<DexOption
									isSelected={state.value === "GOBBLER"}
									setSelectedDex={() => handleChange("GOBBLER")}
									logo={GobblerLogo.src}
									name="GOBBLER"
									description="Creator earns half the fees from trades of the underlying tokens, ppl that ape earn the other half. No bonding target. You don't get to choose the input tokens, yolo."
									learnMoreLink="https://meteora.xyz"
								/>

								<DexOption
									isSelected={state.value === "fomo3d"}
									setSelectedDex={() => handleChange("fomo3d")}
									logo={RaydiumLogo.src}
									name="Fomo3d"
									description="Your plain ol' launch with a bonding target n all that"
									learnMoreLink=""
								/>
							</>
						)}
					/>
				</div>


				<div className="flex flex-col gap-4">
					<Field
						name="tokenSymbol"
						validators={{
							onSubmit: ({ value }) => (!value ? "Token symbol is required" : undefined),
						}}
						children={({ state, handleChange, handleBlur }) => (
							<Input
								label="Token Symbol"
								fullWidth
								classNames={{ input: "text-lg", label: "text-lg", errorMessage: "text-md" }}
								defaultValue={state.value}
								size="lg"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
								errorMessage={state.meta.errors.join(",")}
								isInvalid={state.meta.errors.length > 0}
								onBlur={handleBlur}
							/>
						)}
					/>
					<Field
						name="tokenName"
						validators={{
							onSubmit: ({ value }) => (!value ? "Token name is required" : undefined),
						}}
						children={({ state, handleChange, handleBlur }) => (
							<Input
								label="Token Name"
								fullWidth
								classNames={{ input: "text-lg", label: "text-lg", errorMessage: "text-md" }}
								defaultValue={state.value}
								size="lg"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
                errorMessage={state.meta.errors.join(",")}
								isInvalid={state.meta.errors.length > 0}
								onBlur={handleBlur}
							/>
						)}
					/>
					<Field
						name="description"
						validators={{
							onSubmit: ({ value }) => {
								if (!value) return "Description is required";
								if (value.length > 1000) return "Description must be 1000 characters or less";
								return undefined;
							},
						}}
						children={({ state, handleChange, handleBlur }) => (
							<Textarea
								label="Description"
								fullWidth
								classNames={{ input: "text-lg", label: "text-lg", errorMessage: "text-md" }}
								defaultValue={state.value}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
								size="lg"
                description={`${state.value.length} / 1000`}
                errorMessage={state.meta.errors.join(",")}
								isInvalid={state.meta.errors.length > 0}
								onBlur={handleBlur}
							/>
						)}
					/>
					<div className="grid grid-cols-1 md:grid-cols-4 grid-0 gap-y-4 md:gap-4 -mt-0 md:-mt-2">
						<Field name="icon" children={({ state, handleChange, handleBlur }) => <IconDropZone onFileChange={(image: any) => handleChange(image)} />} />

						<Field name="banner" children={({ state, handleChange, handleBlur }) => <BannerDropZone onFileChange={(image: any) => handleChange(image)} />} />
					</div>

					<Divider />

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Field
							name="website"
							children={({ state, handleChange, handleBlur }) => (
								<Input
									label="Website"
									fullWidth
									classNames={{ input: "text-lg mt-0", label: "text-lg leading-none" }}
									labelPlacement="outside"
									placeholder="website link"
									defaultValue={state.value}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
									size="lg"
									onBlur={handleBlur}
								/>
							)}
						/>
						<Field
							name="twitter"
							children={({ state, handleChange, handleBlur }) => (
								<Input
									label="X/Twitter"
									fullWidth
									classNames={{ input: "text-lg mt-0", label: "text-lg leading-none" }}
									labelPlacement="outside"
									placeholder="x link"
									defaultValue={state.value}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
									onBlur={handleBlur}
									size="lg"
								/>
							)}
						/>
						<Field
							name="telegram"
							children={({ state, handleChange, handleBlur }) => (
								<Input
									label="Telegram"
									fullWidth
									classNames={{ input: "text-lg mt-0", label: "text-lg leading-none" }}
									labelPlacement="outside"
									placeholder="telegram link"
									defaultValue={state.value}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
									onBlur={handleBlur}
									size="lg"
								/>
							)}
						/>
						<Field
							name="discord"
							children={({ state, handleChange, handleBlur }) => (
								<Input
									label="Discord"
									fullWidth
									classNames={{ input: "text-lg mt-0", label: "text-lg leading-none" }}
									labelPlacement="outside"
									placeholder="discord link"
									defaultValue={state.value}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
									onBlur={handleBlur}
									size="lg"
								/>
							)}
						/>
						<Field
							name="otherLink"
							children={({ state, handleChange, handleBlur }) => (
								<Input
									label="Other Link"
									fullWidth
									classNames={{ input: "text-lg mt-0", label: "text-lg leading-none" }}
									labelPlacement="outside"
									placeholder="other link"
									defaultValue={state.value}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
									onBlur={handleBlur}
									size="lg"
								/>
							)}
						/>
					</div>

					<Divider />

					<div>
						<Field
							name="initialBuy"
							children={({ state, handleChange, handleBlur }) => (
								<Input
									label="Initial Buy"
									description="Optional: be the very first person to buy your token"
									fullWidth
									classNames={{
										input: "text-lg relative top-[6.2px]",
										label: "text-lg leading-none",
										description: "text-lg",
									}}
									type="number"
									startContent={
										<div className="flex items-center gap-2 relative top-[4px]">
											<Icon icon="token-branded:solana" className="w-4" />
											<span>SOL</span>
										</div>
									}
									defaultValue={state.value}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
									onBlur={handleBlur}
								/>
							)}
						/>
					</div>

					<Field
						name="agreeTerms"
						children={({ state, handleChange }) => (
							<Checkbox checked={state.value} onChange={(e) => handleChange(e.target.checked)}>
								I agree to the FOMO3D <Link href="#">Terms of Service</Link>
							</Checkbox>
						)}
					/>

					<Button type="submit" fullWidth color="primary" className="text-xl" startContent={<Icon icon="fa6-solid:rocket" className="w-4" />}>
						Launch
					</Button>
				</div>
			</div>
		</form>
	);
}