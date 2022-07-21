import React from 'react'
import {observer} from 'mobx-react-lite'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {bsky, AdxUri} from '@adxp/mock-api'
import moment from 'moment'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {OnNavigateContent} from '../../routes/types'
import {PostThreadViewPostModel} from '../../../state/models/post-thread-view'
import {s} from '../../lib/styles'
import {pluralize} from '../../lib/strings'
import {AVIS} from '../../lib/assets'

function iter<T>(n: number, fn: (_i: number) => T): Array<T> {
  const arr: T[] = []
  for (let i = 0; i < n; i++) {
    arr.push(fn(i))
  }
  return arr
}

export const PostThreadItem = observer(function PostThreadItem({
  item,
  onNavigateContent,
}: {
  item: PostThreadViewPostModel
  onNavigateContent: OnNavigateContent
}) {
  const record = item.record as unknown as bsky.Post.Record
  const hasEngagement = item.likeCount || item.repostCount
  const onPressOuter = () => {
    const urip = new AdxUri(item.uri)
    onNavigateContent('PostThread', {
      name: item.author.name,
      recordKey: urip.recordKey,
    })
  }
  return (
    <TouchableOpacity style={styles.outer} onPress={onPressOuter}>
      <View style={styles.layout}>
        {iter(Math.abs(item._depth), (i: number) => (
          <View key={i} style={styles.replyBar} />
        ))}
        <View style={styles.layoutAvi}>
          <Image
            style={styles.avi}
            source={AVIS[item.author.name] || AVIS['alice.com']}
          />
        </View>
        <View style={styles.layoutContent}>
          <View style={styles.meta}>
            <Text style={[styles.metaItem, s.f15, s.bold]}>
              {item.author.displayName}
            </Text>
            <Text style={[styles.metaItem, s.f14, s.gray]}>
              @{item.author.name}
            </Text>
            <Text style={[styles.metaItem, s.f14, s.gray]}>
              &middot; {moment(item.indexedAt).fromNow(true)}
            </Text>
          </View>
          <Text
            style={[
              styles.postText,
              ...(item._isHighlightedPost
                ? [s.f16, s['lh16-1.3']]
                : [s.f15, s['lh15-1.3']]),
            ]}>
            {record.text}
          </Text>
          {item._isHighlightedPost && hasEngagement ? (
            <View style={styles.expandedInfo}>
              {item.repostCount ? (
                <Text style={[styles.expandedInfoItem, s.gray, s.semiBold]}>
                  <Text style={[s.bold, s.black]}>{item.repostCount}</Text>{' '}
                  {pluralize(item.repostCount, 'repost')}
                </Text>
              ) : (
                <></>
              )}
              {item.likeCount ? (
                <Text style={[styles.expandedInfoItem, s.gray, s.semiBold]}>
                  <Text style={[s.bold, s.black]}>{item.likeCount}</Text>{' '}
                  {pluralize(item.likeCount, 'like')}
                </Text>
              ) : (
                <></>
              )}
            </View>
          ) : (
            <></>
          )}
          <View style={styles.ctrls}>
            <View style={styles.ctrl}>
              <FontAwesomeIcon
                style={styles.ctrlIcon}
                icon={['far', 'comment']}
              />
              <Text>{item.replyCount}</Text>
            </View>
            <View style={styles.ctrl}>
              <FontAwesomeIcon
                style={styles.ctrlIcon}
                icon="retweet"
                size={22}
              />
              <Text>{item.repostCount}</Text>
            </View>
            <View style={styles.ctrl}>
              <FontAwesomeIcon
                style={styles.ctrlIcon}
                icon={['far', 'heart']}
              />
              <Text>{item.likeCount}</Text>
            </View>
            <View style={styles.ctrl}>
              <FontAwesomeIcon
                style={styles.ctrlIcon}
                icon="share-from-square"
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  outer: {
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    backgroundColor: '#fff',
  },
  layout: {
    flexDirection: 'row',
  },
  replyBar: {
    width: 5,
    backgroundColor: 'gray',
    marginRight: 2,
  },
  layoutAvi: {
    width: 80,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  avi: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  layoutContent: {
    flex: 1,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 4,
  },
  metaItem: {
    paddingRight: 5,
  },
  postText: {
    paddingBottom: 5,
  },
  expandedInfo: {
    flexDirection: 'row',
    padding: 10,
    borderColor: '#e8e8e8',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  expandedInfoItem: {
    marginRight: 10,
  },
  ctrls: {
    flexDirection: 'row',
  },
  ctrl: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 4,
    paddingRight: 4,
  },
  ctrlIcon: {
    marginRight: 5,
    color: 'gray',
  },
})