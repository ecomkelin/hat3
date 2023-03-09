module.exports = (reqBody, { is_Many = false }) => {
    const { match, projection, skip, limit, sort, lookups, unwinds } = reqBody;
    /** project 要在 lookup 下面 */
    const pipelines = [];
    pipelines.push({ "$match": match })

    /** find元素   注意 limit：1 其实就是 findOne */
    if (is_Many) {
        if (skip) pipelines.push({ "$skip": skip })
        if (limit) pipelines.push({ "$limit": limit })
        if (sort) pipelines.push({ "$sort": sort })
    } else {
        pipelines.push({ "$limit": 1 })
    }

    if (lookups instanceof Array) {
        for (let i in lookups) {
            pipelines.push({ "$lookup": lookups[i] });
        }
    }

    /** 把数组变为对象 */
    if (unwinds instanceof Array) {
        for (let i in unwinds) {
            pipelines.push({ "$unwind": unwinds[i] });
        }
    }

    if (projection && Object.keys(projection).length > 0) pipelines.push({ "$project": projection })

    return pipelines;
}