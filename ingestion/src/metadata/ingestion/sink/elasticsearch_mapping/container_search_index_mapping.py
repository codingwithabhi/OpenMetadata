#  Copyright 2021 Collate
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#  http://www.apache.org/licenses/LICENSE-2.0
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
"""
Defines the Elasticsearch mapping for Containers
"""
import textwrap

CONTAINER_ELASTICSEARCH_INDEX_MAPPING = textwrap.dedent(
    """
{
  "settings": {
    "analysis": {
      "normalizer": {
        "lowercase_normalizer": {
          "type": "custom",
          "char_filter": [],
          "filter": [
            "lowercase"
          ]
        }
      },
      "analyzer": {
        "om_analyzer": {
          "tokenizer": "letter",
          "filter": [
            "lowercase",
            "om_stemmer"
          ]
        },
        "om_ngram": {
          "tokenizer": "ngram",
          "min_gram": 1,
          "max_gram": 2,
          "filter": [
            "lowercase"
          ]
        }
      },
      "filter": {
        "om_stemmer": {
          "type": "stemmer",
          "name": "english"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "keyword"
      },
      "name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "fullyQualifiedName": {
        "type": "keyword",
        "normalizer": "lowercase_normalizer"
      },
      "displayName": {
        "type": "text",
        "analyzer": "om_analyzer",
        "fields": {
          "ngram": {
            "type": "text",
            "analyzer": "om_ngram"
          }
        }
      },
      "description": {
        "type": "text",
        "index_options": "docs",
        "analyzer": "om_analyzer",
        "norms": false
      },
      "version": {
        "type": "float"
      },
      "updatedAt": {
        "type": "date",
        "format": "epoch_second"
      },
      "updatedBy": {
        "type": "text"
      },
      "href": {
        "type": "text"
      },
      "parent": {
        "properties": {
          "id": {
            "type": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 36
              }
            }
          },
          "type": {
            "type": "text"
          },
          "name": {
            "type": "keyword",
            "normalizer": "lowercase_normalizer",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "fullyQualifiedName": {
            "type": "text"
          },
          "description": {
            "type": "text"
          },
          "deleted": {
            "type": "text"
          },
          "href": {
            "type": "text"
          }
        }
      },
      "dataModel": {
        "properties": {
          "isPartitioned": {
            "type": "boolean"
          },
          "columns": {
            "properties": {
              "name": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "dataType": {
                "type": "text"
              },
              "dataTypeDisplay": {
                "type": "text"
              },
              "description": {
                "type": "text",
                "index_options": "docs",
                "analyzer": "om_analyzer",
                "norms": false
              },
              "fullyQualifiedName": {
                "type": "text"
              },
              "tags": {
                "properties": {
                  "tagFQN": {
                    "type": "keyword"
                  },
                  "labelType": {
                    "type": "keyword"
                  },
                  "description": {
                    "type": "text"
                  },
                  "source": {
                    "type": "keyword"
                  },
                  "state": {
                    "type": "keyword"
                  }
                }
              },
              "ordinalPosition": {
                "type": "integer"
              }
            }
          }
        }
      },
      "children": {
        "properties": {
          "id": {
            "type": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 36
              }
            }
          },
          "type": {
            "type": "keyword"
          },
          "name": {
            "type": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "fullyQualifiedName": {
            "type": "text"
          },
          "description": {
            "type": "text"
          },
          "deleted": {
            "type": "text"
          },
          "href": {
            "type": "text"
          }
        }
      },
      "prefix": {
        "type": "text"
      },
      "numberOfObjects": {
        "type": "integer"
      },
      "size": {
        "type": "integer"
      },
      "fileFormats": {
        "type": "keyword"
      },
      "service": {
        "properties": {
          "id": {
            "type": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 36
              }
            }
          },
          "type": {
            "type": "keyword"
          },
          "name": {
            "type": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "fullyQualifiedName": {
            "type": "text"
          },
          "description": {
            "type": "text"
          },
          "deleted": {
            "type": "text"
          },
          "href": {
            "type": "text"
          }
        }
      },
      "owner": {
        "properties": {
          "id": {
            "type": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 36
              }
            }
          },
          "type": {
            "type": "keyword"
          },
          "name": {
            "type": "keyword",
            "normalizer": "lowercase_normalizer",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "displayName": {
            "type": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "fullyQualifiedName": {
            "type": "text"
          },
          "description": {
            "type": "text"
          },
          "deleted": {
            "type": "text"
          },
          "href": {
            "type": "text"
          }
        }
      },
      "usageSummary": {
        "properties": {
          "dailyStats": {
            "properties": {
              "count": {
                "type": "long"
              },
              "percentileRank": {
                "type": "long"
              }
            }
          },
          "weeklyStats": {
            "properties": {
              "count": {
                "type": "long"
              },
              "percentileRank": {
                "type": "long"
              }
            }
          },
          "monthlyStats": {
            "properties": {
              "count": {
                "type": "long"
              },
              "percentileRank": {
                "type": "long"
              }
            }
          }
        }
      },
      "deleted": {
        "type": "text"
      },
      "followers": {
        "type": "keyword"
      },
      "tier": {
        "properties": {
          "tagFQN": {
            "type": "keyword"
          },
          "labelType": {
            "type": "keyword"
          },
          "description": {
            "type": "text"
          },
          "source": {
            "type": "keyword"
          },
          "state": {
            "type": "keyword"
          }
        }
      },
      "tags": {
        "properties": {
          "tagFQN": {
            "type": "keyword"
          },
          "labelType": {
            "type": "keyword"
          },
          "description": {
            "type": "text"
          },
          "source": {
            "type": "keyword"
          },
          "state": {
            "type": "keyword"
          }
        }
      },
      "serviceType": {
        "type": "keyword"
      },
      "entityType": {
        "type": "keyword"
      },
      "suggest": {
        "type": "completion",
        "contexts": [
          {
            "name": "deleted",
            "type": "category",
            "path": "deleted"
          }
        ]
      },
      "column_suggest": {
        "type": "completion"
      },
      "service_suggest": {
        "type": "completion"
      }
    }
  }
}
"""
)
